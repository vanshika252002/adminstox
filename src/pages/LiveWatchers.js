import { doc, onSnapshot } from '@firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
// import heartFill from "../images/Heart-Fill.png";

const LiveWatchers = ({auctionId, user}) => {
    const [liveData, setLiveData] = useState(null);
    useEffect(() => {

        if (!auctionId) return;

        const auctionRef = doc(db, "auction", auctionId);
        const unsubscribe = onSnapshot(auctionRef, (snapshot) => {
            try {
                if (snapshot.exists()) {
                    const auctionData = snapshot.data();
                    setLiveData(auctionData);
                }
            } catch (error) {
                console.log("erorr in bid status...", error);
            }
        });
        return () => unsubscribe();
    }, [auctionId, user]);
  return (
    <div>
        {/* <img src={heartFill} alt="no found" style={{ height: '16px', width: '18px' }} /> */}
        <span>{liveData && liveData?.watchlist ? liveData?.watchlist : 0}</span>
    </div>
  )
}

export default LiveWatchers