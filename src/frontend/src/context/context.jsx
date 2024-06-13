import { createContext, useState } from "react";
import runChat from '../config/gemma';

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setrecentPrompt] = useState("");
    const [prevPrompts, setprevPrompts] = useState([]);
    const [showResult, setshowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");


    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index)
    }

    const newChat = () => {
        setLoading(false)
        setshowResult(false)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          onSent();
        }
    };

    const handlePredictions = async (e) => {

        const response = await fetch(`http://localhost:8000/predict`)
        const data = await response.text();
        console.log(data)
    }

    handlePredictions()

    const onSent = async () => {

        setResultData("")
        setLoading(true)
        setshowResult(true)
        setrecentPrompt(input)
        setprevPrompts(prev => [...prev, input])
        const response = await runChat(input)
        let responseArray = response.split(" ");
        let newResponse;
        for (let i = 0; i < responseArray.length; i++)
        {
            const nextWord = responseArray[i];
            delayPara(i, nextWord+ " ")
        }

        // setResultData(newResponse)
        setLoading(false)
        setInput("")
    }

    // onSent("yo")

    const contextValue = {
        showResult,
        setprevPrompts,
        onSent,
        recentPrompt,
        loading,
        resultData,
        input,
        setInput,
        prevPrompts,
        newChat,
        handleKeyPress
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider