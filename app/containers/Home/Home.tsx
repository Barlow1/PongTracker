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
      <div className="page justify-center text-center space-y-4">
        <img
          className="justify-self-center mx-auto rounded-md max-h-50vh"
          src="/PlayHero.jpeg"
        />
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
              Leaderboard&nbsp;
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
        <div>
          <Paragraph>
            {`Welcome ${user.name}! You are signed into ${user.organization.name}.`}
          </Paragraph>
          <Paragraph as="span" className="font-bold">
            Organization Code:{' '}
          </Paragraph>
          <Paragraph as="span">{user.organization.code}</Paragraph>
        </div>
      </div>
    </div>
  );
};
export default Home;
