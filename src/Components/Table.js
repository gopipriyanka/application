import React, { useEffect, useState } from 'react'
import axios from "axios"
import './Table.css'
import { FaRegChartBar, FaLevelUpAlt, FaLevelDownAlt, FaCaretDown, FaCaretUp } from 'react-icons/fa'

const PercentageBar = ({ pctChange }) => {
    // Style the bar based on positive or negative percentage change
    const barStyle = {
        width: Math.abs(pctChange) + '%',
        backgroundColor: pctChange >= 0 ? '#4CAF50' : '#F44336',
        height: '10px',
        borderRadius: '10px'
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100px', backgroundColor: 'lightgray', marginRight: '5px', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={barStyle}></div>
            </div>
            <span>{pctChange}%</span>
        </div>
    );
};

function Table() {
    let [users, setUsers] = useState(null);
    const fetchdata = async () => {
        try {
            let response = await axios.get("https://intradayscreener.com/api/openhighlow/cash");
            console.log(response.data);
            setUsers(response.data);
        }
        catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        fetchdata();
    }, [])

    const handleCheckboxChange = (symbol) => {
        console.log("Checkbox for symbol", symbol, "changed");
    };
    const calculateLTPPercentage = (ltp, open) => {
        return ((ltp - open) / open) * 100;
    }
    const getLTPPercentageColor = (ltpPercentage) => {
        return ltpPercentage >= 0 ? 'green' : 'red';
    };

    return (
        <div>
            <table>
                <thead>
                <tr id='head'>
                    <th className='item'>SYMBOL</th>
                    <th className='item'>LTP  <i className="fas fa-info-circle"></i></th>
                    <th className='item'>Momentum  <i className="fas fa-info-circle"></i></th>
                    <th className='item'>OPEN <i className="fas fa-info-circle"></i></th>
                    <th className='item'>Deviation from Pivots</th>
                    <th className='item'>TODAYS RANGE <i className="fas fa-info-circle"></i></th>
                    <th className='item'>OHL <i className="fas fa-info-circle"></i></th>
                </tr>
                </thead>
                <tbody>
                    {users && users.map((item) => (
                        <tr key={item.symbol} style={{ border: '1px solid black' }}>
                            <td style={{ padding: "10px", border: "1px solid black", fontWeight: 'bolder', position: 'relative' }} className='item1'>
                                <input type="checkbox" onChange={() => handleCheckboxChange(item.symbol)} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }} />
                                <span style={{ marginLeft: '20px', color: '#007FFF' }}>{item.symbol} </span>
                                <FaRegChartBar style={{ marginLeft: '20px', color: 'lightash' }} size={23} />
                            </td>
                            <td style={{ padding: "10px", border: "1px solid black" }} className='item2'>
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    <span style={{ marginLeft: '5px' }}>{item.ltp}</span>
                                </div>
                                <div style={{ textAlign: 'center', color: getLTPPercentageColor(calculateLTPPercentage(item.ltp, item.open)) }}>
                                    {calculateLTPPercentage(item.ltp, item.open) >= 0 ? <FaCaretUp style={{ color: 'green', marginTop: '10px' }} /> : <FaCaretDown style={{ color: 'red', marginTop: '10px' }} size={16} />}
                                    {calculateLTPPercentage(item.ltp, item.open).toFixed(2)}%
                                </div>
                            </td>
                            <td style={{ padding: "10px", border: "1px solid black", color: 'green' }} className='item3'>
                                <span style={{ backgroundColor: '#abf7b1', padding: '2px 5px', borderRadius: '10px', marginRight: '5px' }}>
                                    {item.stockOutperformanceRank}</span>
                                <span style={{ backgroundColor: '#abf7b1', padding: '2px 5px', borderRadius: '10px', marginRight: '5px' }}>{' ' + item.stockMomentumRank}</span>
                                <span style={{ backgroundColor: '#abf7b1', padding: '2px 5px', borderRadius: '10px' }}>{' ' + item.sectorMomentumRank}</span>
                            </td>
                            <td style={{ padding: "10px", border: "1px solid black" }} className='item4'>{item.open}</td>
                            <td style={{ padding: "10px", border: "1px solid black" }} className='item5'>{item.pctChange}</td>
                            <td className='item6'>
                                {item.open} <PercentageBar pctChange={item.pctChange} />
                            </td>
                            <td style={{ padding: "10px", fontWeight: 'normal', fontSize: '13px' }} className='item7'>
                                <span style={{ backgroundColor: item.openHighLowSignal === 'Open=Low' ? '#abf7b1' : item.openHighLowSignal === 'Open=High' ? '#FF8A8A' : 'inherit', borderRadius: '80px', padding: '5px', color: item.openHighLowSignal === 'Open=Low' ? '#228C22' : item.openHighLowSignal === 'Open=High' ? '#DA012D' : 'inherit' }}>
                                    {item.openHighLowSignal === 'Open=Low' && <FaLevelUpAlt style={{ color: 'green' }} />}
                                    {item.openHighLowSignal === 'Open=High' && <FaLevelDownAlt style={{ color: 'red' }} />}
                                    {item.openHighLowSignal}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table