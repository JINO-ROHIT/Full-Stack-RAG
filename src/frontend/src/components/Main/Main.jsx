import React, { useContext } from 'react'
import './Main.css'
import {assets} from '../../assets/assets/assets'
import { Context } from '../../context/context'

const Main = () => {

    const {showResult,
        setprevPrompts,
        onSent,
        recentPrompt,
        loading,
        resultData,
        input,
        setInput,
        prevPrompts,
        handleKeyPress} = useContext(Context)
  return (
      <div className="main">
          <div className="nav">
              <p>Gemini</p>
              <img src={assets.user_icon} alt="" />
          </div>

          <div className="main-container">
              
              {!showResult
                  ?
                  <>
                  <div className="greet">
                  <p><span>Hello, Jino</span></p>
                  <p>How can I help you today?</p>
              </div>

              <div className="cards">
                  <div className="card">
                      <p>The author's name</p>
                      <img src={assets.compass_icon} alt="" />
                  </div>

                  <div className="card">
                      <p>What does the author do</p>
                      <img src={assets.bulb_icon} alt="" />
                  </div>

                  <div className="card">
                      <p>What is lisp</p>
                      <img src={assets.message_icon} alt="" />
                  </div>

                  <div className="card">
                      <p>Describe Paul's life</p>
                      <img src={assets.code_icon} alt="" />
                  </div>
              </div>
                  </>
                  : <div className="result">
                      <div className="result-title">
                          <img src={assets.user_icon} alt="" />
                          <p>{recentPrompt}</p>
                      </div>

                      <div className="result-data">
                          <img src={assets.gemini_icon} alt="" />
                          {loading
                              ? <div className="loader">
                                  <hr></hr>
                                  <hr></hr>
                                  <hr></hr>
                            </div>
                              : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                          }
                          
                      </div>
                  </div>
              }

              <div className="main-bottom">
                  
                  <div className="search-box">
                      <input onChange={(e) => setInput(e.target.value)} onKeyUp={handleKeyPress}  value={input} type="text" placeholder='Enter a prompt here' />
                  <div>
                          {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                  </div>
                  </div>
              
              <p className="bottom-info">
                  Gemini may display inaccurate info, including about people, so double-check its responses.
                  </p>
              </div>
              

          </div>

    </div>
  )
}

export default Main