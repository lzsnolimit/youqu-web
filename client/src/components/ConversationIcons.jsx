import React, { useState } from 'react';
import { Modal } from 'antd';
import {
  MdOutlineDelete,
  MdOutlineDone,
  MdOutlineClear,
  MdOutlineUpdate,
  MdDriveFileRenameOutline,
  MdOutlineSettings
} from 'react-icons/md'
import ConversationSetting from "./ConversationSetting";

const ConfirmType = {
  DELETE: 'delete',
  EDIT: 'edit',
}

function ConversationIcons({conversation, onDelete, isSelected}) {

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState(ConfirmType.DELETE);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);


  const onDeleteConversation = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
    setConfirmType(ConfirmType.DELETE)
  }

  const onSettingConversation = (e) => {
    e.stopPropagation();
    setIsSettingsModalVisible(true)
  }


  const handleSettingsModalCancel = (e) => {
    e.stopPropagation();
    setIsSettingsModalVisible(false)
  }

  const onCancel = (e) => {
    e.stopPropagation();
    setShowConfirm(false);
  }

  const onConfirm = (e) => {
    e.stopPropagation();
    if (confirmType === ConfirmType.DELETE) {
      onDelete();
    } else {
      onConfirmEdit();
    }
  }

  const setConversation=(conversationName,systemPromote)=>{
    console.log(systemPromote)
    setIsSettingsModalVisible(false)
  }

  const onConfirmEdit = () => {}

  return(
    <div
      className="conversations__icons"
      style={{visibility: isSelected(conversation) ? 'visible' : 'hidden'}}
    >
      {showConfirm ? (
        <>
          <button className="p-1 hover:text-white">
            <MdOutlineDone size={20} onClick={onConfirm}/>
          </button>
          <button className="p-1 hover:text-white">
            <MdOutlineClear size={20} onClick={onCancel} />
          </button>
        </>
      ) : (
          <>
        <button className="p-1 hover:text-white">
          <MdOutlineSettings size={20} onClick={onSettingConversation} />
        </button>
            <Modal
                title="Conversation Setting"
                open={isSettingsModalVisible}
                onCancel={handleSettingsModalCancel}
                footer={null}
                centered
            >
              <ConversationSetting setConversation={setConversation}/>
            </Modal>


        <button className="p-1 hover:text-white">
          <MdOutlineDelete size={20} onClick={onDeleteConversation} />
        </button>
          </>
      )}
    </div>
  )
}

export default ConversationIcons;