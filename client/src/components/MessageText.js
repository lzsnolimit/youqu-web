import React from 'react';
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import moment from "moment";
const MessageText = ({ ai, content, createdAt }) => {
    const isJson = (str) => {
        try{
            JSON.parse(str);
        }catch (e){
            //Error
            //JSON is not okay
            return false;
        }
        return true;
    }
    const parseContent = () => {
        console.log(content.result)
        try{
            const jsonObj = JSON.parse(content);
            console.log("result:"+jsonObj)
            return jsonObj.result;
        }catch (e){
            console.log(e)
            //console.log("result:"+content)
            return content;
        }
    }

    return (
        <div className="message__wrapper">
            <ReactMarkdown
                className={`message__markdown ${ai ? 'text-left' : 'text-right'}`}
                children={content.hasOwnProperty("result")?content.result:content}
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || 'language-js');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                children={String(children).replace(/\n$/, '')}
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            />
            <div
                className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>{moment(createdAt).fromNow()}</div>
        </div>

    );
};

export default MessageText