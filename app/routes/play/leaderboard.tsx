import { LoaderFunction, useLoaderData } from 'remix';
import { H1 } from '~/components/Typography/Typography';
import { getUsersByOrgId } from '~/services/user.server';
import { Player } from '~/utils/types';
import { requireUser } from '~/utils/user.session';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  const orgUsers = await getUsersByOrgId(user.orgId);
  return { orgUsers };
};

const sortByEloDesc = (playerA: Player, playerB: Player) => {
  return playerB.elo - playerA.elo;
};

export default function Leaderboard() {
  const { orgUsers } = useLoaderData<{ orgUsers: Player[] }>();
  return (
    <div className="container main-content">
      <div className="page justify-center text-center">
        <H1>Leaderboard</H1>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>ELO</th>
            </tr>
          </thead>
          <tbody>
            {orgUsers
              .sort(sortByEloDesc)
              .splice(0, 9)
              .map((player, rank) => {
                return (
                  <tr
                    className="border-2 border-gray-100 rounded-md"
                    key={player.id}
                  >
                    <td className="p-5 md:p-10">{`${rank + 1}`}</td>
                    <td className="p-5 md:p-10">{`${player.name}`}</td>
                    <td className="p-5 md:p-10">{`${player.elo}`}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
