import {useEffect, useState} from 'react'
import { get, keys, set } from 'idb-keyval';
import {ulid} from 'ulid'


const useIndexedDB = (store, initData) => {

  const initMapData = initData ? new Map([[initData.id, initData]]) : new Map();

  const [mapData, setMapData] = useState(new Map());


  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messageKeys = await keys(store);

        const fetchedMessages = await Promise.all(
          messageKeys.map(async (messageID) => {
            const value = await get(messageID, store);
            return [messageID, value];
          })
        );

        const newMessages = new Map([...fetchedMessages, ...initMapData]);

        // if(newMessages.size <= 0){
        //   storeData(initData);
        // } else {
        //   setMapData(newMessages)
        // }
        setMapData(newMessages)
      } catch (error) {
        console.error('Error fetching all messages:', error);
        setMapData(initMapData);
      }
    };
    loadMessages();
  }, []);


  const saveDataToDB = (data) => {
    const _data = data?.id ? data : {...data, id: ulid()};

    return set(_data.id, _data, store).then(() => {
      console.log(_data)
      const map = new Map();
      map.set(_data.id, _data);
      setMapData(pre=> new Map([...pre, ...map]));
    })
  }

  const clearMessages = () => setMapData(new Map(initMapData));

  return {dbData: mapData, setMapData, saveDataToDB, clearMessages};
};

export default useIndexedDB;