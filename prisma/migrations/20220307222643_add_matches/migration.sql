-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "teamOneScore" INTEGER NOT NULL,
    "teamTwoScore" INTEGER NOT NULL,
    "gameType" VARCHAR(10) NOT NULL,
    "winner" VARCHAR(10) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerMatch" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "team" VARCHAR(10) NOT NULL,
    "won" BOOLEAN NOT NULL,

    CONSTRAINT "PlayerMatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatch" ADD CONSTRAINT "PlayerMatch_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
