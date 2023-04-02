import React, {useState} from "react";
import {Button, Upload} from "antd";

const PreTrainingUpload = () => {
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleClick = () => {
        setOpen(true);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            alert("请只上传PDF文件。");
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            sendFile(selectedFile);
        }
        setOpen(false);
    };

    const sendFile = (file) => {
        // 这里实现你的文件上传逻辑，例如使用fetch或者axios等库发送到服务器
    };

    return (
        <Upload>
            <Button>Click to Upload</Button>
        </Upload>
    );
};

export default PreTrainingUpload;