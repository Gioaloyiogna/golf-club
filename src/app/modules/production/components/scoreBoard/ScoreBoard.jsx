import axios from 'axios'
import {useState, useEffect} from 'react'

import {KTCard} from '../../../../../_metronic/helpers'
import {API_URL, BASE_URL} from '../../../../urls'
import {useQuery} from 'react-query'
import {getPlayers} from '../Requests'
import {useParams} from 'react-router-dom'
import {Button, Card, Col, Form, Input, message, Modal, Row, Select, Space, Table, Tabs} from 'antd'

const ScoreBoard = () => {
  // const [loading, setLoading] = useState(false);
  // const [course, setCourse] = useState(null);
  //
  // let content = {};
  //
  // useEffect(() => {
  //     fetchData();
  // }, [])
  //
  // const fetchData = async () => {
  //
  //     const TEE_SVC_URL = 'tees.json';
  //
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
  //
  // if (loading || course == null) {
  //     content.list = <div>Loading...</div>;
  // } else {
  //     let yardsOut,
  //       yardsIn,
  //       yards,
  //       parOut,
  //       parIn,
  //       par;
  //
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
  //
  // return (
  //   <div className="course">
  //       {content.list}
  //   </div>
  // )
  const [data, setData] = useState([])
  const {data: playerNamesFromApi} = useQuery('playersQuery', () => getPlayers())
  const {time} = useParams()
  const date1 = time.slice(0, 10)
  const date2 = time.slice(10, 15)
  const date = date1 + ' ' + date2

  const playerNames = playerNamesFromApi?.data.filter((item) => {
    return item.teeTime === date
  })

  async function fetchData() {
    const data = await axios.get(`${API_URL}/Holestbls`)

    setData(data.data)
  }
  console.log(data)

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <KTCard>
        <div className='table-responsive'>
          <table
            className='table border gy-5 gs-5'
            id={'myTable'}
            onClick={(e) => {
              // clickCell(e, dateSelected);
            }}
          >
            <thead className='border'>
              <tr className='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'>
                <th className='min-w-50px bg-secondary'></th>
                {data?.map((item, index) => {
                  if (index<9) {
                    return (
                      <th className='min-w-100px bg-secondary' key={item.id}>
                        Hole {item.holeNumber}
                      </th>
                    )
                  }
                })}
              
              </tr>
            </thead>
            <tbody className='border'>
              <tr>
                <th className='fw-bold fs-6 text-gray-800 bg-primary'>Yards</th>
                {data?.map((item, index) => {
                  if (index<9) {
                    let total = 0
                  return (
                    <>
                      <td className={'bg-primary'} key={item.id}>
                        {item.yardage}
                      </td>
                    </>
                  )
                  }
                })}
                
              </tr>
              <tr>
                <th className='fw-bold fs-6 text-gray-800 bg-success'>Par</th>
                {data?.map((item,index) => {
                 if (index<9) {
                  return (
                    <td className={'bg-success'} key={item.id}>
                      {item.par}
                    </td>
                  )
                 }
                })}
               
              </tr>
              {playerNames?.map((item) => {
                return (
                  <tr>
                    <th className='fw-light fs-6 text-gray-800 m-0'>{item.playerName}</th>
                    {data?.map((item, index) => {
                     if (index <9) {
                      return (
                        <td
                          contentEditable={true}
                          key={item.id}
                          onKeyPress={(event) => {
                            if (isNaN(Number(event.key))) {
                              event.preventDefault()
                            }
                          }}
                          onInput={(event) => {
                            const maxLength = 4; // maximum allowed length
                            if (event.target.innerText.length > maxLength) {
                              event.target.innerText = event.target.innerText.slice(0, maxLength);
                            }
                          }}
                        >
                          {item.stroke}
                        </td>
                      )
                     }
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </KTCard>
      <KTCard>
        <div className='table-responsive'>
          <table
            className='table border gy-5 gs-5'
            id={'myTable'}
            onClick={(e) => {
              // clickCell(e, dateSelected);
            }}
          >
            <thead className='border'>
              <tr className='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'>
                <th className='min-w-50px bg-secondary'></th>
                {data?.map((item, index) => {
                 if (index>=9) {
                  return (
                    <th className='min-w-100px bg-secondary' key={item.id}>
                      Hole {item.holeNumber}
                    </th>
                  )
                 }
                })}
                <th className='min-w-100px bg-secondary'>Total</th>
              </tr>
            </thead>
            <tbody className='border'>
              <tr>
                <th className='fw-bold fs-6 text-gray-800 bg-primary'>Yards</th>
                {data?.map((item, index) => {
                 if (index>=9) {
                  let total = 0
                  return (
                    <>
                      <td className={'bg-primary'} key={item.id}>
                        {item.yardage}
                      </td>
                    </>
                  )
                 }
                })}
                <td className={'bg-primary'}>
                  {data?.reduce((total, item) => {
                    return total + Number(item.yardage)
                  }, 0)}
                </td>
              </tr>
              <tr>
                <th className='fw-bold fs-6 text-gray-800 bg-success'>Par</th>
                {data?.map((item, index) => {
                  if (index>=9) {
                    return (
                      <td className={'bg-success'} key={item.id}>
                        {item.par}
                      </td>
                    )
                  }
                })}
                <td className={'bg-success'}>
                  {data?.reduce((total, item) => {
                    return total + Number(item.par)
                  }, 0)}
                </td>
              </tr>
              {playerNames?.map((item) => {
                return (
                  <tr>
                    <th className='fw-light fs-6 text-gray-800 m-0'>{item.playerName}</th>
                    {data?.map((item, index) => {
                     if (index >=9) {
                      return (
                        <td
                          contentEditable={true}
                          key={item.id}
                          onKeyPress={(event) => {
                            if (isNaN(Number(event.key))) {
                              event.preventDefault()
                            }
                          }}
                          onInput={(event) => {
                            const maxLength = 4; // maximum allowed length
                            if (event.target.innerText.length > maxLength) {
                              event.target.innerText = event.target.innerText.slice(0, maxLength);
                            }
                          }}
                        >
                          {item.stroke}
                        </td>
                      )
                     }
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </KTCard>
      <>
        <Form>
          <Form.Item className='d-flex'>
            <Button
              type='primary'
              htmlType='submit'
              className='menu-title m-1'
              style={{backgroundColor: '#47be7d'}}
            >
              submit
            </Button>
            <Button
              type='secondary'
              htmlType='submit'
              className='menu-title text-white'
              style={{backgroundColor: 'gray'}}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </>
    </>
  )
}

export {ScoreBoard}
