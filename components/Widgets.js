import { SearchIcon } from "@heroicons/react/outline";
import News from "./News";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AccordionButton from "./AccordionButton";

export default function Widgets({ newsResults }) {
  const [articleNum, setArticleNum] = useState(3);
  return (
    <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-5">
      <div className="w-[90%] xl:w-[75%] sticky top-0 bg-white py-1.5 z-50">
        <div className="flex items-center p-3 rounded-full bg-red-300 relative ">
          <SearchIcon className="h-5 z-50 text-gray-500" />
          <input
            className="absolute inset-0 rounded-full pl-11 border-blue-500 text-gray-700 focus:shadow-lg focus:bg-white bg-gray-100"
            type="text"
            placeholder="Search twitter"
          />
        </div>
      </div>

      <div className="text gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%]">
        <h4 className="font-bold text-xl px-4">Whats happening</h4>
      </div>
      <AnimatePresence>
        {newsResults.slice(0, articleNum).map((article) => (
          <motion.div
            key={article.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <News key={article.title} article={article} />
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={() => setArticleNum(articleNum + 3)}
        className="text-blue-300 pl-4 pb-3 hover:text-blue-400"
      >
        Show More
      </button>

      <div> Test area </div>
 <AccordionButton title="">
      
        <p>Button Button Button Button</p>
      </AccordionButton> 
    </div>
  );
}
