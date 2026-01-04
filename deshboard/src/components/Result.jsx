import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { BookOpenCheck } from 'lucide-react';

import Hifiz from "../pages/Hifiz";
import { toggleHifizCollage } from "../store/slices/extraSlice";

const Result = () => {

    const dispatch = useDispatch();

    const { isHifizCollageOpened } = useSelector((state) => state.extra);

    return(<>
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
        {/* HEADER */}
        <div className="flex-1 p-6">
            <Header />
            <h1 className="text-2xl font-bold">Result</h1>
            <p className="text-sm text-gray-600 mb-6">Manage all Results</p>
        </div>

        {/* INSTITUTIONS */}
        <div className="p-4 sm:p-8 bg-gray-50 min-h-full">
            <div className="flex justify-start md:m-8 min-h-full min-w-full gap-6 mt-4 ml-2">
                <button className="relative w-36 h-40 shadow-md rounded-3xl border
                    flex flex-col items-center justify-center mb-3 hover:border-gray-500"
                    onClick={() => dispatch(toggleHifizCollage())}>
                    <BookOpenCheck className="w-8 h-auto mb-2" />
                    <h1 className="text font-medium">Hifzul Quran College</h1>
                    <p className="text-xs text-gray-400">Check Resut</p>
                </button>

                <button className="relative w-36 h-40 shadow-md rounded-3xl border
                    flex flex-col items-center justify-center mb-3 hover:border-gray-500">
                    <BookOpenCheck className="w-8 h-auto mb-2" />
                    <h1 className="text font-medium">Uthmaniyya College</h1>
                    <p className="text-xs text-gray-400">Check Resut</p>
                </button>
            </div>
        </div>
        
        {isHifizCollageOpened && <Hifiz />}
    </main>
    </>)
};

export default Result;