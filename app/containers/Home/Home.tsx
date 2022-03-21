import {
  faNewspaper,
  faPlus,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'remix';
import Button from '~/components/Button/Button';
import { Paragraph } from '~/components/Typography/Typography';
import { PlayerWithOrg } from '~/utils/types';

interface IHomeProps {
  user: PlayerWithOrg;
}

const Home = ({ user }: IHomeProps) => {
  return (
    <div className="container main-content">
      <div className="page justify-center text-center">
        <img className="justify-self-center" src="/pingpongtable.png" />
        <div className="flex flex-col grow space-y-4 md:block md:space-x-4">
          <Link
            className="decoration-current"
            to="/play/match"
            prefetch="intent"
          >
            <Button color="blue" style={{ width: '200px' }}>
              Record Match&nbsp;
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Link>
          <Link to="/play/leaderboard" prefetch="intent">
            <Button color="blue" style={{ width: '200px' }}>
              LeaderBoard&nbsp;
              <FontAwesomeIcon icon={faTrophy} />
            </Button>
          </Link>
          <Link to="/play/history" prefetch="intent">
            <Button color="blue" style={{ width: '200px' }}>
              History&nbsp;
              <FontAwesomeIcon icon={faNewspaper} />
            </Button>
          </Link>
        </div>
        {
          <Paragraph>
            {`Welcome ${user.name}! You are signed into ${user.organization.name}.`}
          </Paragraph>
        }
      </div>
    </div>
  );
};
export default Home;
