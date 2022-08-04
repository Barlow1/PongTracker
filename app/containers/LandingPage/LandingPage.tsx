import {
  faArrowRight,
  faList,
  faMedal,
  faMoneyBill,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'remix';
import Button from '~/components/Button/Button';
import LandingPageSection from '~/components/LandingPageSection/LandingPageSection';
import { H3, H4, Paragraph } from '~/components/Typography/Typography';
import { useUser } from '~/hooks/useRootData';
import { routes } from '~/routes';

const LandingPage = () => {
  const user = useUser();
  return (
    <>
      <div className="container main-content">
        <div className=" justify-center text-center">
          <LandingPageSection>
            {' '}
            <img
              className="mx-auto rounded-md max-h-50vh"
              src="/PongTrackerHero.jpeg"
            />
            <H3 className="justify-self-center">
              We make workplaces more fun!
            </H3>
            <Paragraph>
              Spice 🌶 up your office with a little competition. Get historical
              score tracking and live leader boards for FREE 🏆
            </Paragraph>
            {user ? (
              <Link
                className="justify-self-center block"
                prefetch="intent"
                to={'/play'}
              >
                <Button color="blue">Play now!</Button>
              </Link>
            ) : (
              <Link
                className="justify-self-center block"
                to={routes.register.path}
              >
                <Button color="blue">
                  Get Started <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </Link>
            )}
          </LandingPageSection>
          <LandingPageSection>
            <H3>Features</H3>
            <div className="md:grid md:grid-cols-2 gap-4">
              <div className="relative border-2 hover:border-primary border-secondary rounded-lg p-5 bg-secondary md:hover:scale-105 h-full">
                <H4>
                  <FontAwesomeIcon icon={faList} /> Score Tracking
                </H4>
              </div>
              <div className="relative border-2 hover:border-primary border-secondary rounded-lg p-5 bg-secondary md:hover:scale-105 h-full">
                <H4>
                  <FontAwesomeIcon icon={faTrophy} /> Live Leaderboard
                </H4>
              </div>
              <div className="relative border-2 hover:border-primary border-secondary rounded-lg p-5 bg-secondary md:hover:scale-105 h-full">
                <H4>
                  <FontAwesomeIcon icon={faMedal} /> Tournaments
                </H4>
              </div>
              <div className="relative border-2 hover:border-primary border-secondary rounded-lg p-5 bg-secondary md:hover:scale-105 h-full">
                <H4>
                  <FontAwesomeIcon icon={faMoneyBill} /> FREE
                </H4>
              </div>
            </div>
          </LandingPageSection>
          <LandingPageSection isDividerHidden={true}>
            <H3>Questions?</H3>
            <Paragraph>
              Email me:{' '}
              <a href="mailto:cbarlow@uzervision.com?subject=Pong%20Tracker%20Question%20🙋">
                Christian Barlow 📨
              </a>
            </Paragraph>
          </LandingPageSection>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
