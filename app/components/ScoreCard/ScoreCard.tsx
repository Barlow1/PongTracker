import { faXmarkCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { GameType, MatchErrors } from '~/routes/play/match';
import { Player, TEAM } from '~/utils/types';
import Button from '../Button/Button';
import InputError from '../FormElements/InputError';
import { H5, Paragraph } from '../Typography/Typography';

interface IScoreCardProps {
  team: string;
  gameType: GameType;
  orgUsers: Player[];
  errors?: MatchErrors;
  disabled?: boolean;
}

type AllProps = IScoreCardProps &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const ScoreCard = ({
  title,
  team,
  className,
  gameType,
  orgUsers,
  errors,
  disabled,
  ...rest
}: AllProps): JSX.Element => {
  const [selected, setSelected] = useState<Player[]>([]);
  const [disablePlayerSelection, setDisablePlayerSelection] =
    useState<boolean>(false);
  const selectPlayer = (User: Player, userSelected: boolean) => {
    let newSelected = [...selected];
    if (userSelected) {
      newSelected = newSelected.filter(
        (selectedUser) => selectedUser.id !== User.id
      );
    } else {
      newSelected.push(User);
    }
    setSelected(newSelected);
  };
  const limit: number = gameType === GameType.DOUBLES ? 2 : 1;

  useEffect(() => {
    if (selected.length > limit) {
      setSelected([]);
    } else if (selected.length === limit) {
      setDisablePlayerSelection(true);
    } else {
      setDisablePlayerSelection(false);
    }
  }, [selected, limit]);
  return (
    <div
      key={`${team}ScoreCard`}
      {...rest}
      className={`border-2 border-gray-100 rounded-md w-full p-5 md:w-72  ${className}`}
    >
      <div className="text-center">
        <H5>{title}</H5>
      </div>
      <div>
        <label htmlFor={team} className="mr-2">
          Winner
        </label>
        <input
          className="disabled:checked:bg-blue-500"
          disabled={disabled}
          id={team}
          type="radio"
          name="Winner"
          value={team}
        />
      </div>
      <div>
        {team === TEAM.TEAM1 && errors?.teamOneScore && (
          <InputError id={`${team}ScoreErrors`}>
            {errors?.teamOneScore}
          </InputError>
        )}
        {team === TEAM.TEAM2 && errors?.teamTwoScore && (
          <InputError id={`${team}ScoreErrors`}>
            {errors?.teamTwoScore}
          </InputError>
        )}
        <label htmlFor={`${team}Score`} className="mr-2">
          Score
        </label>
        <input
          type="number"
          id={`${team}Score`}
          name={`${team}Score`}
          defaultValue={0}
          min={0}
          disabled={disabled}
        />
      </div>
      <div>
        {team === TEAM.TEAM1 && errors?.teamOnePlayers && (
          <InputError id={`${team}PlayerErrors`}>
            {errors?.teamOnePlayers}
          </InputError>
        )}
        {team === TEAM.TEAM2 && errors?.teamTwoPlayers && (
          <InputError id={`${team}PlayerErrors`}>
            {errors?.teamTwoPlayers}
          </InputError>
        )}
        <Paragraph>
          Select {gameType === GameType.DOUBLES ? 'Players' : 'Player'}
        </Paragraph>
      </div>
      <div>
        <ul>
          {orgUsers.map((user) => {
            const userSelected = !!selected.find(
              (selectedUser) => selectedUser.id === user.id
            );
            return (
              <li key={user.id}>
                <Button
                  onClick={() => {
                    selectPlayer(user, userSelected);
                  }}
                  disabled={
                    disabled || (disablePlayerSelection && !userSelected)
                  }
                  className={`m-2 ${
                    userSelected && 'bg-gray-300 dark:bg-gray-500'
                  }`}
                >
                  {user.name}&nbsp;
                  {userSelected ? (
                    <FontAwesomeIcon icon={faXmarkCircle} />
                  ) : (
                    <FontAwesomeIcon icon={faPlus} />
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
        <input
          type="hidden"
          name={`${team}Players`}
          value={JSON.stringify(selected)}
        />
      </div>
    </div>
  );
};

export default ScoreCard;
