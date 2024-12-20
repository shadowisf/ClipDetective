import { useEffect, useRef, useState } from "react";
import { generateSeries, series } from "../utils/SeriesUtils";
import { movies } from "../utils/MoviesUtils";
import { PlayIcon } from "@heroicons/react/24/solid";
import { Modal_1B } from "./Modal";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";
import { firebaseStorage } from "../../firebase";
import { sleepFor, waitForEvent } from "../utils/GeneralUtils";

export default function ClipPlayer({ type }: { type: string }) {
  // data types of media data
  type Clip = {
    title: string;
    title64: string;
    src: string[];
  };

  // hooks
  const navigate = useNavigate();

  // startup states
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const [currentTitle, setCurrentTitle] = useState<string>("");
  const [clueTitle, setClueTitle] = useState<Array<string>>([]);
  const [timestamp, setTimestamp] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>("");
  const [wrongGuesses, setWrongGuesses] = useState<Array<string>>([]);
  const [replayDuration, setReplayDuration] = useState<number>(5000);
  const [futureScore, setFutureScore] = useState<number>(100);
  const [isClipPlaying, setIsClipPlaying] = useState<boolean>(false);
  const [hasUserInput, setHasUserInput] = useState<boolean>(false);
  const [isFirstTimePlay, setIsFirstTimePlay] = useState<boolean>(true);

  // modals
  const [isCorrectModalOpen, setIsModalCorrectOpen] = useState<boolean>(false);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState<boolean>(false);

  // references
  const videoElementRef = useRef<HTMLVideoElement>(null);

  // sounds
  const correctSound = new Audio("/correct.mp3");
  const incorrectSound = new Audio("/incorrect.mp3");

  // IMPORTANT STATES
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<Array<string>>([]);
  const [allMedia] = useState<Array<Clip>>(type === "series" ? series : movies);

  // generates random clip
  // plays clip at a random timestamp
  // disables user input until done playing
  async function handlePlay() {
    setIsClipPlaying(true);

    await generateMedia();

    if (videoElementRef.current) {
      const videoElement = videoElementRef.current;
      const fullDuration = videoElement.duration;
      const bufferTime = 15;
      const randomStart = Math.random() * (fullDuration - bufferTime);

      videoElement.currentTime = randomStart;
      setTimestamp(videoElement.currentTime);
      videoElement.volume = 1;

      await waitForEvent(videoElement, "timeupdate");

      videoElement.play();

      if (videoElement.played) {
        await sleepFor(replayDuration);

        videoElement.pause();
        setIsClipPlaying(false);
        setIsFirstTimePlay(false);
        setHasUserInput(true);
      }
    }
  }

  // validates user's guess input
  // if correct, open correct modal and move to next clip
  // else, put wrong guesses in array state.
  // if wrong guesses exceed 4, open skip modal
  function handleGuess() {
    const cleanGuess = userGuess.toLowerCase();

    setUserGuess("");

    switch (true) {
      case cleanGuess === currentTitle:
        correctSound.volume = 0.25;
        correctSound.play();
        setIsModalCorrectOpen(true);
        setHasUserInput(false);
        setCurrentProgress((prevProgress) => [...prevProgress, currentTitle]);
        setCurrentScore(currentScore + futureScore);
        break;
      case cleanGuess === "":
        return;
      default:
        incorrectSound.volume = 0.25;
        incorrectSound.play();
        setWrongGuesses((prevWrongGuesses) => [
          ...prevWrongGuesses,
          cleanGuess,
        ]);
        wrongGuesses.length === 4 ? setIsSkipModalOpen(true) : "";
    }
  }

  // replays clip with increments of 5s
  // disables user inputs until done playing
  async function handleReplay() {
    setUserGuess("");

    if (videoElementRef.current) {
      setReplayDuration(replayDuration + 5000);
      setFutureScore(futureScore - 25);

      videoElementRef.current.currentTime = timestamp;
      videoElementRef.current.play();
      setIsClipPlaying(true);
      setHasUserInput(false);

      await sleepFor(replayDuration + 5000);

      videoElementRef.current ? videoElementRef.current.pause() : "";
      setIsClipPlaying(false);
      setHasUserInput(true);
    }
  }

  // set user input to empty string and set startup states to default values
  function resetAll() {
    setCurrentSrc("");
    setCurrentTitle("");
    setClueTitle([]);
    setUserGuess("");
    setFutureScore(100);
    setReplayDuration(5000);
    setTimestamp(0);
    setWrongGuesses([]);
    setIsClipPlaying(false);
    setHasUserInput(false);
    setIsFirstTimePlay(true);
  }

  // generate clip based on type and set it to src and title
  async function generateMedia() {
    const allowedChar = /[ \-:,.\/]/;

    switch (type) {
      case "series":
        const generatedSeries = generateSeries();
        const clipSeries = ref(firebaseStorage, generatedSeries.src);
        const clipUrl = await getDownloadURL(clipSeries);
        const clipSeriesAlreadyDone =
          currentProgress.includes(generatedSeries.title) ||
          generatedSeries.title === currentTitle;

        if (clipSeriesAlreadyDone) {
          return generateMedia();
        } else {
          setCurrentSrc(clipUrl);
          setCurrentTitle(generatedSeries.title);

          const underScoreArray = generatedSeries.title
            .split("")
            .map((char) => {
              if (!allowedChar.test(char)) {
                return Math.random() < 0.85 ? "_" : char;
              } else {
                return char;
              }
            });

          setClueTitle(underScoreArray);
        }
        break;
      case "movies":
        // to be added
        break;
    }
  }

  // disables play/pause, backward/forward, seek actions of OS and headphones
  function disableCHEATING() {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("pause", () => {
        console.log("blocked pause");
      });
      navigator.mediaSession.setActionHandler("play", () => {
        console.log("blocked play");
      });
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        console.log("blocked backward seek");
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        console.log("blocked forward seek");
      });
    }
  }

  // at mount, disable cheating
  useEffect(() => {
    resetAll();
    disableCHEATING();
  }, []);

  return (
    <main className="ms-10 me-10 flex flex-col justify-center items-center h-screen gap-5">
      <section className="flex flex-col gap-5 text-center">
        <div className="flex gap-12 justify-center">
          <span>
            <strong>score:</strong> {currentScore}
          </span>
          <span>
            <strong>total:</strong> {currentProgress.length}/{allMedia.length}
          </span>
        </div>
        <div className="flex gap-3 justify-center">
          {wrongGuesses.map((element, index) => (
            <div key={index} className="rounded-md ps-2 pe-2 bg-red-500">
              {element}
            </div>
          ))}
        </div>
        {isCorrectModalOpen ? (
          <div className="ms-12 me-12 align-center flex flex-wrap gap-3 font-bold text-center">
            {currentTitle.split("").map((letter, index) => {
              return <span key={index}>{letter}</span>;
            })}
          </div>
        ) : (
          <div className="ms-12 me-12 flex flex-wrap gap-3 font-bold text-center">
            {clueTitle.map((letter, index) => {
              return (
                <span className={letter === " " ? "ms-3 me-3" : ""} key={index}>
                  {letter}
                </span>
              );
            })}
          </div>
        )}
      </section>

      <section className="relative">
        <video
          disableRemotePlayback={true}
          ref={videoElementRef}
          src={currentSrc}
          width="900"
          className="rounded-xl"
        />

        {!isClipPlaying ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black rounded-xl">
            {isFirstTimePlay ? (
              <button
                className="rounded-full p-4 flex flex-col justify-center items-center"
                onClick={handlePlay}
              >
                <PlayIcon className="h-24 w-24 fill-[#5D5D81]" />
                click play to start
              </button>
            ) : (
              "any guesses? 🤓"
            )}
          </div>
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black rounded-xl"
            style={{ zIndex: -1 }}
          >
            loading... 🪄
          </div>
        )}
      </section>

      <form
        className="flex flex-col justify-center items-center gap-5"
        onSubmit={handleGuess}
      >
        <input
          name="guess"
          className="text-black p-2 rounded-lg w-96 text-center"
          type="text"
          onChange={(e) => setUserGuess(e.target.value)}
          value={userGuess}
          list="suggestions"
          style={!hasUserInput ? { opacity: 0.5, cursor: "no-drop" } : {}}
          disabled={!hasUserInput}
          required
        />

        <datalist id="suggestions">
          {userGuess.length > 0
            ? allMedia.map((element, index) => (
                <option key={index} value={element.title} />
              ))
            : ""}
        </datalist>

        <div className="flex justify-center gap-5">
          <button
            className="ps-4 pe-4 pt-2 pb-2 rounded-lg text-white font-bold bg-[#5D5D81]"
            onClick={handleGuess}
            disabled={!hasUserInput}
            style={!hasUserInput ? { opacity: 0.5, cursor: "no-drop" } : {}}
          >
            guess 🤔
          </button>
          <button
            className="ps-4 pe-4 pt-2 pb-2 rounded-lg bg-white font-bold"
            onClick={handleReplay}
            disabled={!hasUserInput || replayDuration === 20000}
            style={
              !hasUserInput || replayDuration === 20000
                ? { opacity: 0.5, cursor: "no-drop" }
                : {}
            }
          >
            replay (+{replayDuration === 20000 ? "15" : replayDuration / 1000}
            s) 🔄
          </button>
          <button
            className="ps-4 pe-4 pt-2 pb-2 rounded-lg bg-white font-bold"
            onClick={resetAll}
            disabled={!hasUserInput}
            style={!hasUserInput ? { opacity: 0.5, cursor: "no-drop" } : {}}
          >
            skip ⏩
          </button>
        </div>
      </form>

      {currentProgress.length === allMedia.length ? (
        <Modal_1B
          isModalOpen={isCorrectModalOpen}
          setIsModalOpen={setIsModalCorrectOpen}
          title={`congratulations! 🏆`}
          content={`you have guessed all ${allMedia.length} clips from the ${type} that i have binge-watched!`}
          buttonLabel="back to home 🏠"
          buttonAction={() => {
            setIsModalCorrectOpen(false);
            navigate("/");
          }}
        />
      ) : (
        <Modal_1B
          isModalOpen={isCorrectModalOpen}
          setIsModalOpen={setIsModalCorrectOpen}
          title={`${currentTitle} is correct! ✅`}
          buttonLabel="next clip ➡️"
          buttonAction={() => {
            setIsModalCorrectOpen(false);
            resetAll();
          }}
        />
      )}

      <Modal_1B
        isModalOpen={isSkipModalOpen}
        setIsModalOpen={setIsSkipModalOpen}
        title={`yikes! 😢`}
        content={`you have guessed too many times! i suggest skipping this one.`}
        buttonLabel="skip ⏩"
        buttonAction={() => {
          setIsSkipModalOpen(false);
          resetAll();
        }}
      />
    </main>
  );
}
