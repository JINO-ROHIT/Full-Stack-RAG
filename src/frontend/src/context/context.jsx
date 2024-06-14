import { createContext, useState } from "react";

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

        console.log(input)
        const response = await fetch(`http://localhost:8000/predict?prompt=${input}}`)
        const data = await response.text();
        console.log(data)
    }

    // handlePredictions()

    const onSent = async () => {

        setResultData("")
        setLoading(true)
        setshowResult(true)
        setrecentPrompt(input)
        setprevPrompts(prev => [...prev, input])
        // const response = await runChat(input)
        const data = await fetch(`http://localhost:8000/predict?prompt=${input}}`)
        const data_text = await data.text();

        const parsedData = JSON.parse(data_text);
        const response = parsedData.result.trim();
        // console.log(response)

        let responseArray = response.split(" ");
        let newResponse;
        for (let i = 0; i < responseArray.length; i++)
        {
            const nextWord = responseArray[i];
            delayPara(i, nextWord+ " ")
        }

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