import axios from 'axios'

import Hole from './Hole'
import {Button, Dropdown, Input, MenuProps, Space, Table, Modal, message, Form} from 'antd'
import {ReactChild, ReactFragment, ReactPortal, useEffect, useState} from 'react'
import {Link, Route, Routes} from 'react-router-dom'
import {KTCard, KTCardBody, KTSVG} from '../../../../../_metronic/helpers'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import {useQuery} from 'react-query'
import {getAllTees, getPlayers} from '../Requests'
import {AlipayCircleFilled, CiCircleFilled, CiCircleOutlined} from '@ant-design/icons'

const ScoreBoardMain = () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const {data: teeSlotData} = useQuery('slotsQuery', () => getAllTees())
  const {data: getPlayersData} = useQuery('playersQuery', () => getPlayers())
  let playersArray: any[] = []
  function playersDataFunc(t: any) {
    let time = `${new Date(t).toISOString().slice(0, 10)} ${t.toLocaleString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    })}`

    const data = getPlayersData?.data.filter((item: any) => {
      return item.teeTime == time
    })
    playersArray.push(data)
  }
  console.log('players', playersArray)

  const teeTimeArrayData: any = []
  // teeSlotData?.data.filter(te=>)
  let index = 0
  teeSlotData?.data.filter((item: any) => {
    const itemDate = new Date(item)
    const today = new Date(Date.now())
  
    if (itemDate >= oneWeekAgo && itemDate < today) {
      teeTimeArrayData.push({
        teeTime: itemDate.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        dataIndex: index,
        teeTime2: itemDate,
      })
      index++
      playersDataFunc(itemDate)
    }
    return itemDate >= oneWeekAgo
  })

  const columns: any = [
    {
      title: 'Tees',
      dataIndex: 'teeTime',
      sorter: (a: any, b: any) => {
        if (a.txmanf > b.txmanf) {
          return 1
        }
        if (b.txmanf > a.txmanf) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Players',
      render: (record: any) => {
        const players = playersArray[record.dataIndex] || []
        return players.map((player: any) => {
          return (
            <div key={player.playerId}>
              <label className='d-flex'>
                <div className='d-flex justify-items-center'>
                  <p className='fs-7 m-0 pl-2'>{player.playerName}</p>
                </div>
              </label>
            </div>
          )
        })
      },
    },
    {
      title: 'Action',
      render: (record: any) => {
        return (
          <>
            <Space size='middle'>
              <a
                href={`score/${new Date(record.teeTime2).toISOString().slice(0, 10)}${record.teeTime2.toLocaleString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                })}`}
                className='btn btn-light-warning btn-sm'
              >
                Update Score
              </a>
            </Space>
          </>
        )
      },
    },
  ]
  // const [loading, setLoading] = useState(false);
  // const [course, setCourse] = useState(null);

  // let content = {};

  // useEffect(() => {
  //     fetchData();
  // }, [])

  // const fetchData = async () => {

  //     const TEE_SVC_URL = 'tees.json';

  //     try {
  //         setLoading(true);
  //         const response = await axios.get(TEE_SVC_URL);
  //         const data = response.data
  //         setCourse(data);
  //         setLoading(false);
  //     } catch (e) {
  //         console.log(e);
  //         setLoading(false);
  //     }
  // }

  // if (loading || course == null) {
  //     content.list = <div>Loading...</div>;
  // } else {
  //     let yardsOut,
  //       yardsIn,
  //       yards,
  //       parOut,
  //       parIn,
  //       par;

  //     content.list = course.tees.map((item) => {
  //         yardsOut = 0;
  //         yardsIn = 0;
  //         yards = 0;
  //         parOut = 0;
  //         parIn = 0;
  //         par = 0;
  //         return (
  //           <div className="tee-container">
  //               <div className="scorecard">
  //                   <div className="header">
  //                       <div className="tee">{item.tee} {item.gender}</div>
  //                   </div>
  //                   {item.holes.map((hole, i) => {
  //                       yards = yards + Number(hole.yards);
  //                       par = par + Number(hole.par);
  //                       if (i < 9) {
  //                           yardsOut = yardsOut + Number(hole.yards);
  //                           parOut = parOut + Number(hole.par);
  //                       }
  //                       if (i > 8) {
  //                           yardsIn = yardsIn + Number(hole.yards);
  //                           parIn = parIn + Number(hole.par);
  //                       }
  //                       return (
  //                         <Hole index={i} item={hole} yardsOut={yardsOut} yardsIn={yardsIn} yards={yards} parOut={parOut} parIn={parIn} par={par} />
  //                       );
  //                   })}
  //                   <div className="footer">
  //                       <div>Slope {item.slope}</div>
  //                       <div>Rating {item.rating}</div>
  //                   </div>
  //               </div>
  //           </div>
  //         );
  //     });
  // }

  // return (
  //   <div className="course">
  //       {content.list}
  //   </div>
  // )
  const [data, setData] = useState([])
  async function fetchData() {
    const data = await axios.get('tees.json')
    setData(data.data.tees[0].holes)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <PageTitle>ScoreBoard</PageTitle>
      <KTCard>
        <KTCardBody>
          <div className='d-flex justify-content-between'>
            <Space style={{marginBottom: 16}}>
              <Input placeholder='Enter Search Text' type='text' allowClear />
              <Button type='primary'>Search</Button>
            </Space>
          </div>
        </KTCardBody>
      </KTCard>
      <Table
        className='table-responsive'
        rowKey={'id'}
        columns={columns}
        bordered
        dataSource={teeTimeArrayData}
      />
    </>

    //                onClick={(e) => {
    //                    // clickCell(e, dateSelected);
    //                }}>
    //             <thead className="border">
    //             <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
    //                 <th className="min-w-50px bg-secondary"></th>
    //                 {data.map((item) => {
    //                     return (
    //                         <th className="min-w-100px bg-secondary" key={item.number}>Hole {item.number}</th>
    //                     )
    //                 })}
    //                 <th className="min-w-100px bg-secondary">Total</th>
    //             </tr>
    //             </thead>
    //             <tbody
    //                 className="border"
    //             >
    //             <tr>
    //                 <th className="fw-bold fs-6 text-gray-800 bg-primary">Yards</th>
    //                 {data.map((item) => {
    //                     let total = 0;
    //                     return (
    //                         <>
    //                             <td className={'bg-primary'} key={item.number}>{item.yards}</td>
    //                         </>
    //                     )
    //                 })}
    //                 <td className={'bg-primary'}>
    //                     {data.reduce((total, item) => {
    //                         return total + Number(item.yards)
    //                     }, 0)}
    //                 </td>
    //             </tr>
    //             <tr>
    //                 <th className="fw-bold fs-6 text-gray-800 bg-success">Par</th>
    //                 {data.map((item) => {
    //                     return (
    //                         <td className={'bg-success'} key={item.number}>{item.par}</td>
    //                     )
    //                 })}
    //                 <td className={'bg-success'}>
    //                     {data.reduce((total, item) => {
    //                         return total + Number(item.par)
    //                     }, 0)}
    //                 </td>
    //             </tr>
    //             <tr>
    //                 <th className="fw-bold fs-6 text-gray-800">Stroke</th>
    //                 {data.map((item) => {
    //                     return (
    //                         <td contentEditable={true} key={item.number}>{item.stroke}</td>
    //                     )
    //                 }   )}
    //             </tr>
    //             </tbody>
    //         </table>
    //     </div>

    // </KTCard>
  )
}

export {ScoreBoardMain}
