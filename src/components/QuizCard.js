import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

import LoadingJson from "../animations/loading.json";
import CongratulationGif from "../animations/congratulation.gif";
import { scripts } from "./dummyData";

const QuizCard = () => {
  const [data, setData] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [script, setScript] = useState([]);
  const [countryNames, setCountryNames] = useState([]);
  const [answerCountry, setAnswerCountry] = useState("");
  const [numOfQuestions, setNumOfQuestions] = useState(1);
  const [marks, setMarks] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setAnswerCountry("");
    setData(false);

    const scrip = scripts[Math.floor(Math.random() * scripts.length)];

    const res = await fetch(`https://restcountries.com/v3.1/all`);
    const cData = await res.json();

    const selectedCountry = cData[Math.floor(Math.random() * cData.length)];

    const firCountryName =
      cData[Math.floor(Math.random() * cData.length)].name.common;
    const secCountryName =
      cData[Math.floor(Math.random() * cData.length)].name.common;
    const thirCountryName =
      cData[Math.floor(Math.random() * cData.length)].name.common;

    if (
      firCountryName == secCountryName ||
      firCountryName == thirCountryName ||
      secCountryName == thirCountryName ||
      firCountryName == selectedCountry.name.common ||
      secCountryName == selectedCountry.name.common ||
      thirCountryName == selectedCountry.name.common
    ) {
      fetchData();
    }

    setCountryNames([
      firCountryName,
      secCountryName,
      thirCountryName,
      selectedCountry.name.common,
    ]);

    setSelectedCountryName(selectedCountry.name.common);
    setData(selectedCountry);
    setScript(scrip);
  };

  const answer = (selectedData) => {
    setAnswerCountry(selectedData);

    if (selectedData == data.name.common) {
      setMarks(marks + 1);
    }
  };

  const restart = () => {
    fetchData();
    setNumOfQuestions(1);
    setMarks(0);
  };

  return (
    <div className="w-full min-h-screen py-10 bg-[#24243e] flex justify-center items-center px-1">
      {numOfQuestions > 10 ? (
        <FinalCard mark={marks} restart={restart} />
      ) : data ? (
        <div
          className={`md:w-1/2 w-full  h-auto  sm:px-10 px-4 pb-10 pt-2 bg-white rounded-lg shadow-lg relative
        ${
          answerCountry
            ? answerCountry == data.name.common
              ? "bg-green-100"
              : "bg-red-100"
            : ""
        }`}
        >
          <div className="w-full h-16 flex justify-between items-center">
            <div
              className=" bg-cyan-500 sm:w-12 sm:h-12 w-10 h-10 sm:text-base text-xs rounded-full flex justify-center items-center
        font-extrabold text-white"
            >
              {numOfQuestions}/10
            </div>

            <div
              className=" bg-green-500 sm:w-12 sm:h-12 w-10 h-10 sm:text-base text-xs rounded-full flex justify-center items-center
        font-extrabold text-white"
            >
              {marks}
            </div>
          </div>

          <img
            src={data.flags.png}
            alt="flag"
            className="w-[300px] mx-auto mb-10 border border-black border-opacity-30"
          />

          <div className="w-full grid grid-cols-1 ">
            {script.map((code, index) => {
              return (
                <div
                  key={index}
                  className={`w-full h-10 border-2 border-[#24243e] rounded-sm flex justify-center items-center
            truncate px-2 cursor-pointer sm:text-lg text-xs mt-3 sm:hover:scale-105
            ${
              answerCountry
                ? countryNames[code] == data.name.common
                  ? "bg-green-500 text-white border-0"
                  : "bg-red-600 text-white border-0"
                : ""
            }`}
                  onClick={() => {
                    answer(countryNames[code]);
                  }}
                >
                  {countryNames[code]}
                </div>
              );
            })}
          </div>

          {answerCountry && (
            <div className="w-full h-12 mt-5 flex justify-center items-center">
              <div
                className="w-36 h-12 bg-[#24243e] flex justify-center items-center text-white
          font-bold cursor-pointer hover:rounded-full rounded-full sm:rounded-none 
          transition duration-200 text-sm font-sans my-20"
                onClick={() => {
                  fetchData();
                  setNumOfQuestions(numOfQuestions + 1);
                }}
              >
                Next Quiz
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="md:w-1/2 w-full  h-auto  sm:px-10 px-4 pb-10 pt-2 bg-white rounded-lg shadow-lg relative">
          <div className="sm:w-1/2 w-full mx-auto">
            <Lottie animationData={LoadingJson} loop={true} />
          </div>
        </div>
      )}
    </div>
  );
};

const FinalCard = ({ mark, restart }) => {
  return (
    <div className="md:w-1/2 w-full  h-auto  sm:px-10 px-2 py-10 bg-white rounded-lg shadow-lg relative">
      <div className="sm:w-1/2 w-full mx-auto">
        <img src={CongratulationGif} alt="congratulaiton" />
      </div>
      <div className="font-mono w-full text-center leading-10 sm:text-base text-sm">
        Congratulation!! You get{" "}
        <span className="font-bold bg-[#f7ff00] p-2">{mark}marks</span> in{" "}
        <span className="font-bold bg-[#f7ff00] p-2">10questions</span>
      </div>
      <div className="w-full h-24 flex justify-center items-center">
        <div
          className="px-7 py-3 rounded-full flex justify-center items-center bg-green-500 text-white
        sm:text-base text-xs cursor-pointer hover:opacity-80"
          onClick={restart}
        >
          Let's Play Again
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
