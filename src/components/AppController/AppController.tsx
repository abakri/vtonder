import React, { useEffect, useRef, useState} from "react";
import profiles from "../../data/profiles.json";
import { TiHeart, TiTimes } from "react-icons/ti";

export const AppController: React.FC = () => {
    const [page, setPage] = useState<number>(0);

    const nextProfile = () => {
        if(page < profiles.length - 1) setPage(page + 1);
    }

    return (
        <div className="w-full h-full sm:w-[600px] sm:h-[1000px] sm:border-[10px] sm:border-purple-400 sm:rounded-3xl overflow-hidden">
            <div className="flex flex-row h-full overflow-x-hidden">
                {profiles.map(({id, name, images, bio, prompts }) => (
                    <div key={id} style={{transform: `translateX(-${page * 100}%)`, transition: "0.3s ease-out"}} className="transform flex flex-col items-center min-w-full max-w-full h-full overflow-y-scroll scrollbar-hide p-2 sm:p-8 gap-y-4 bg-gray-100">
                        <div className="rounded-3xl bg-white">
                            <h1 className="text-2xl font-bold w-full pt-6 px-6 pb-[20px]">{name}</h1>
                            <img className="object-cover h-[365px] w-full" src={`/${images[0]}`} alt={name} />
                            <div className="w-full px-6 py-[30px]">
                                <p className="text-lg">{bio}</p>
                            </div>
                        </div>
                        <img className="object-cover h-[365px] w-full rounded-3xl" src={`/${images[1]}`} alt={name} />
                        <div className="flex flex-col gap-y-2 w-full px-6 py-[70px] rounded-3xl bg-white">
                            <h1 className="text-md">{prompts[0].prompt}</h1>
                            <p className="font-semibold text-2xl">{prompts[0].answer}</p>
                        </div>
                        <img className="object-cover h-[365px] w-full rounded-3xl" src={`/${images[2]}`} alt={name} />
                        <div className="flex flex-col gap-y-2 w-full px-6 py-[70px] rounded-3xl bg-white">
                            <h1 className="text-md">{prompts[1].prompt}</h1>
                            <p className="font-semibold text-2xl">{prompts[1].answer}</p>
                        </div>
                        <div className="flex flex-col gap-y-2 w-full px-6 py-[70px] rounded-3xl bg-white">
                            <h1 className="text-md">{prompts[2].prompt}</h1>
                            <p className="font-semibold text-2xl">{prompts[2].answer}</p>
                        </div>
                        <div className="flex flex-row w-full min-h-[150px] justify-between items-center px-[15%]">
                            <button
                                className="flex justify-center items-center bg-white border-4 border-black rounded-full text-[85px] select-none scale-100 transition hover:scale-125 hover:bg-red-500 hover:text-white"
                                onClick={nextProfile}
                            >
                                <TiTimes/>
                            </button>
                            <button
                                className="flex justify-center items-center bg-white border-4 border-black rounded-full text-[85px] select-none scale-100 transition hover:scale-125 hover:bg-pink-300 hover:text-white"
                                onClick={nextProfile}
                            >
                                <TiHeart/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};
