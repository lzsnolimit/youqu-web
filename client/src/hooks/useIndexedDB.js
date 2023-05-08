import {useEffect, useState} from 'react'
import { get, keys, set, del, delMany } from 'idb-keyval';
import {ulid} from 'ulid'
import { MESSAGE_TYPE } from "../common/constant";





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
      const map = new Map();
      map.set(_data.id, _data);
      setMapData(pre=> new Map([...pre, ...map]));
    })
  }

  const deleteDataById = (id) => {
    return del(id, store).then(() => {
      const map = new Map(mapData);
      map.delete(id);
      setMapData(map);
    })
  }

  const deleteManyByIds = (ids = []) => {
    return delMany(ids, store).then(() => {
      const map = new Map(mapData);
      ids.forEach(id => map.delete(id));
      setMapData(map);
    })
  }

  const clearMessages = () => setMapData(new Map(initMapData));

  return {dbData: mapData, setMapData, saveDataToDB, clearMessages, deleteDataById, deleteManyByIds};
};

export default useIndexedDB;