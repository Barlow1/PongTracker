import {
  faCheck,
  faPlus,
  faXmarkSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Match, PlayerMatch } from '@prisma/client';
import { Link, LoaderFunction, useLoaderData } from 'remix';
import Button from '~/components/Button/Button';
import { H1, Paragraph } from '~/components/Typography/Typography';
import { useUser } from '~/hooks/useRootData';
import { getPlayerElo } from '~/services/elo.server';
import { getMatchesByPlayerId, getWinCount } from '~/services/match.server';
import { Player, TEAM } from '~/utils/types';
import { requireUser } from '~/utils/user.session';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const playerMatches = await getMatchesByPlayerId(user.id);
  const totalWins = await getWinCount(user.id);
  const elo = await getPlayerElo(user.id);
  return { playerMatches, totalWins, elo };
};

export default function History() {
  const { playerMatches, totalWins, elo } = useLoaderData<{
    playerMatches: (Match & {
      playerMatches: (PlayerMatch & { player: Player })[];
    })[];
    totalWins: number;
    elo: number;
  }>();
  const user = useUser();

  return (
    <div className="container main-content">
      <div className="page justify-center text-center">
        <H1>Match History</H1>
        <Paragraph>Total Wins: {totalWins}</Paragraph>
        <Paragraph>ELO: {elo}</Paragraph>

        {!playerMatches.length ? (
          <>
          <br/>
            <Paragraph>No matches found 🥲</Paragraph>
            <Link
              className="decoration-current"
              to="/play/match"
              prefetch="intent"
            >
              <Button color="blue">
                Record a match&nbsp;
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </Link>
          </>
        ) : null}

        {playerMatches.map((match) => {
          return (
            <div
              className="border-2 border-gray-100 rounded-md p-10"
              key={match.id}
            >
              <Paragraph>Match ID: {match.id}</Paragraph>
              <div className="flex justify-center content-center">
                <Paragraph className="pr-3">Won: </Paragraph>
                <FontAwesomeIcon
                  className="self-center"
                  color={
                    match.playerMatches.find((pm) => pm.playerId === user?.id)
                      ?.won
                      ? 'green'
                      : 'red'
                  }
                  icon={
                    match.playerMatches.find((pm) => pm.playerId === user?.id)
                      ?.won
                      ? faCheck
                      : faXmarkSquare
                  }
                />
              </div>
              <Paragraph>Game Type: {match.gameType}</Paragraph>
              <Paragraph>
                Score: {match.teamOneScore} - {match.teamTwoScore}
              </Paragraph>
              <Paragraph>
                Team 1:{' '}
                {match.playerMatches
                  .filter((value) => value.team === TEAM.TEAM1)
                  .map((player, index) => {
                    return (
                      (player.playerId === user?.id
                        ? 'You'
                        : player.player.name) +
                      (index ===
                      match.playerMatches.filter(
                        (value) => value.team === TEAM.TEAM1
                      ).length -
                        1
                        ? ''
                        : ', ')
                    );
                  })}
              </Paragraph>
              <Paragraph>
                Team 2:{' '}
                {match.playerMatches
                  .filter((value) => value.team === TEAM.TEAM2)
                  .map((player, index) => {
                    return player.playerId === user?.id
                      ? 'You'
                      : player.player.name +
                          (index ===
                          match.playerMatches.filter(
                            (value) => value.team === TEAM.TEAM2
                          ).length -
                            1
                            ? ''
                            : ', ');
                  })}
              </Paragraph>
            </div>
          );
        })}
      </div>
    </div>
  );
}
