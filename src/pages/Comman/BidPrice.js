import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { realdb } from '../../firebase';

const BidPrice = ({ id }) => {
    const [bidPrice, setBidPrice] = useState('0');
    const EuroFormat = (num) => {
        if (num === 0) {
            return `€ 0`;
        } else {
            return new Intl.NumberFormat("nl-NL", {
                style: "currency",
                currency: "EUR",
                minimumFractionDigits: 2,
            }).format(num);
        }
    };

    useEffect(() => {
        if (!id) return;
        const productRef = ref(realdb, `products/${id}`);
        const unsubscribe = onValue(productRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data?.variants && Array.isArray(data?.variants)) {
                    setBidPrice(data?.variants[0] ? String(data?.variants[0]?.bid_amount) : '0');
                }
            } else {
                setBidPrice('0');
            }
        });
        return () => unsubscribe();
    }, [id]);

    return (
        <div>{`${EuroFormat(Number(bidPrice))}`}</div>
    )
};

export default BidPrice;