import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
  useTransition,
} from 'remix';
import Button from '~/components/Button/Button';
import InputError from '~/components/FormElements/InputError';
import ScoreCard from '~/components/ScoreCard/ScoreCard';
import { Paragraph } from '~/components/Typography/Typography';
import { recalculateEloRankings } from '~/services/elo.server';
import { createMatch, createPlayerMatches } from '~/services/match.server';
import { getUsersByOrgId } from '~/services/user.server';
import { Player, TEAM } from '~/utils/types';
import { requireUser } from '~/utils/user.session';

interface MatchLoaderData {
  orgUsers: Player[];
}

export enum GameType {
  SINGLES = 'Singles',
  DOUBLES = 'Doubles',
}

export type MatchActionData = {
  success?: boolean;
  errors?: MatchErrors;
  values?: MatchFormValues;
};

type MatchFormValues = {
  gameType: string | null;
  winner: string | null;
  teamOneScore: string | null;
  teamTwoScore: string | null;
  teamOnePlayers: string | null;
  teamTwoPlayers: string | null;
};

export interface MatchErrors extends MatchFormValues {
  generalError: string | null;
}

const getGameTypeError = (gameType: string | null) => {
  if (!gameType) {
    return 'Game Type is required';
  }
  return null;
};

const getWinnerError = (winner: string | null) => {
  if (!winner) {
    return 'Please select a winner';
  }
  return null;
};

const getScoreError = (score: string | null) => {
  if (!score) {
    return 'Please enter a score';
  }
  if (Number(score) < 0) {
    return 'Please enter a positive and nonzero score.';
  }
  return null;
};

const getPlayersError = (
  players: string | null,
  otherPlayers: string | null,
  gameType: string | null
) => {
  let parsedPlayers: Player[];
  if (!players) {
    return `Please select ${
      gameType === GameType.DOUBLES ? '2 players' : 'a player'
    } `;
  }
  try {
    parsedPlayers = JSON.parse(players);
  } catch {
    return 'Failed to add players, try choosing new players & resubmitting';
  }
  if (gameType === GameType.SINGLES) {
    if (parsedPlayers.length !== 1) {
      return 'Please select exactly one player in singles mode';
    }
  }
  if (gameType === GameType.DOUBLES) {
    if (parsedPlayers.length !== 2) {
      return 'Please select two players in doubles mode';
    }
  }
  let parsedOtherPlayers;
  if (otherPlayers) {
    try {
      parsedOtherPlayers = JSON.parse(otherPlayers);
    } catch {
      return null;
    }
  } else {
    return null;
  }
  const duplicatePlayerMessage = checkForDuplicatePlayers(
    parsedPlayers,
    parsedOtherPlayers
  );
  if (duplicatePlayerMessage) {
    return duplicatePlayerMessage;
  }

  return null;
};

const checkForDuplicatePlayers = (
  players: Player[],
  otherPlayers: Player[]
) => {
  for (const player of players) {
    const duplicate = otherPlayers.find(
      (otherPlayer) => player.id === otherPlayer.id
    );
    if (duplicate) {
      return `You cannot select ${duplicate.name} more than once, please select a new player`;
    }
  }
  return null;
};

const getCompareScoreError = (
  teamOneScore: string | null,
  teamTwoScore: string | null,
  winner: string | null
): string | null => {
  const compareError =
    'The winning team cannot have a lower score than the loser';
  if (winner === TEAM.TEAM1) {
    if (Number(teamTwoScore) > Number(teamOneScore)) {
      return compareError;
    }
  } else if (winner === TEAM.TEAM2) {
    if (Number(teamOneScore) > Number(teamTwoScore)) {
      return compareError;
    }
  }
  return null;
};

const getMatchErrors = (values: MatchFormValues): MatchErrors => {
  const errors: MatchErrors = {
    gameType: getGameTypeError(values.gameType),
    winner: getWinnerError(values.winner),
    teamOneScore: getScoreError(values.teamOneScore),
    teamTwoScore: getScoreError(values.teamTwoScore),
    teamOnePlayers: getPlayersError(
      values.teamOnePlayers,
      values.teamTwoPlayers,
      values.gameType
    ),
    teamTwoPlayers: getPlayersError(
      values.teamTwoPlayers,
      values.teamOnePlayers,
      values.gameType
    ),
    generalError: getCompareScoreError(
      values.teamOneScore,
      values.teamTwoScore,
      values.winner
    ),
  };
  return errors;
};

export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const values: MatchFormValues = {
    gameType: form.get('GameType'),
    winner: form.get('Winner'),
    teamOneScore: form.get('Team1Score'),
    teamTwoScore: form.get('Team2Score'),
    teamOnePlayers: form.get('Team1Players'),
    teamTwoPlayers: form.get('Team2Players'),
  };
  const errors = getMatchErrors(values);
  let key: keyof MatchErrors;
  for (key in errors) {
    if (errors[key]) {
      return json({ success: false, errors });
    }
  }
  try {
    //submit
    const match = {
      gameType: values.gameType ?? 'undefined',
      winner: values.winner ?? 'undefined',
      teamOneScore: Number(values.teamOneScore ?? '0'),
      teamTwoScore: Number(values.teamTwoScore ?? '0'),
    };
    const newMatch = await createMatch(match);
    const teamOnePlayers = JSON.parse(values.teamOnePlayers || '');
    const teamTwoPlayers = JSON.parse(values.teamTwoPlayers || '');

    await Promise.all([
      createPlayerMatches({
        match: newMatch,
        teamOnePlayers,
        teamTwoPlayers,
      }),
      recalculateEloRankings(teamOnePlayers, teamTwoPlayers, match.winner),
    ]);
    return { success: true };
  } catch {
    errors.generalError =
      'Failed to save match, please try again in a few minutes.';
    return json({ success: false, errors });
  }
};

export const loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}): Promise<MatchLoaderData> => {
  const user = await requireUser(request);
  const orgUsers = await getUsersByOrgId(user.orgId);
  return { orgUsers };
};

export default function Match() {
  const { orgUsers } = useLoaderData<MatchLoaderData>();
  const [gameType, setGameType] = useState<GameType>(GameType.SINGLES);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGameType = (event: any) => {
    setGameType(event.target.value);
  };

  const reloadWindow = () => window.location.reload();

  const data = useActionData<MatchActionData>();
  const success = data?.success;
  const transition = useTransition();

  return (
    <div>
      <Form method="post">
        <div className="flex justify-center rounded-md w-fit mx-auto my-5">
          <button
            type="button"
            onClick={handleGameType}
            disabled={data?.success}
            value={GameType.SINGLES}
            className={`m-auto rounded-md rounded-r-none border-r-0 border-2 p-5 ${
              gameType !== GameType.SINGLES
                ? 'border-gray-100 hover:bg-blue-500 disabled:hover:bg-transparent'
                : 'border-blue-500 bg-blue-500'
            }`}
          >
            Singles
          </button>
          <button
            type="button"
            onClick={handleGameType}
            disabled={data?.success}
            value={GameType.DOUBLES}
            className={`m-auto rounded-md rounded-l-none border-l-0 border-2 p-5 ${
              gameType !== GameType.DOUBLES
                ? 'border-gray-100 hover:bg-red-500 disabled:hover:bg-transparent'
                : 'border-red-500 bg-red-500'
            }`}
          >
            Doubles
          </button>
        </div>
        <input type="hidden" name="GameType" value={gameType} />
        <div className="text-center p-2">
          {data?.errors?.winner && (
            <InputError id="WinnerError">{data.errors.winner}</InputError>
          )}
          {data?.errors?.generalError && (
            <InputError id="WinnerError">{data.errors.generalError}</InputError>
          )}
        </div>
        <div className="flex-wrap flex justify-evenly space-y-4 md:space-y-0">
          <ScoreCard
            orgUsers={orgUsers}
            team={TEAM.TEAM1}
            title={'Team 1'}
            gameType={gameType}
            className={'ml-0'}
            errors={data?.errors}
            disabled={data?.success}
          />
          <ScoreCard
            orgUsers={orgUsers}
            team={TEAM.TEAM2}
            title={'Team 2'}
            gameType={gameType}
            className={'mr-0'}
            errors={data?.errors}
            disabled={data?.success}
          />
        </div>
        <div className="flex justify-center rounded-md w-fit mx-auto my-5">
          {transition.state === 'submitting' ? (
            <Paragraph>Submitting...</Paragraph>
          ) : success ? (
            <Paragraph>
              Match Submitted!{' '}
              <a
                className="underlined"
                href="/play/match"
                onClick={reloadWindow}
              >
                Record another&nbsp;
                <FontAwesomeIcon icon={faPlus} />
              </a>
            </Paragraph>
          ) : (
            <Button type="submit" color="green">
              Submit Match
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
