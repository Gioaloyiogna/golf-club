import axios from 'axios'

import Hole from './Hole'
import {Button, Dropdown, Input, MenuProps, Space, Table, Modal, message, Form} from 'antd'
import {ReactChild, ReactFragment, ReactPortal, useEffect, useState} from 'react'
import {Link, Route, Routes} from 'react-router-dom'
import {KTCard, KTCardBody, KTSVG} from '../../../../../_metronic/helpers'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import {Query, useQuery, useQueryClient} from 'react-query'
import {getAllTees, getPlayers} from '../Requests'
import {AlipayCircleFilled, CiCircleFilled, CiCircleOutlined} from '@ant-design/icons'
//  score board main
const ScoreBoardMain = () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const {data: teeSlotData} = useQuery('slotsQuery', () => getAllTees())
  const {data: getPlayersData} = useQuery('playersQuery', () => getPlayers())
  const queryClient = useQueryClient()
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
                href={`score/${new Date(record.teeTime2)
                  .toISOString()
                  .slice(0, 10)}${record.teeTime2.toLocaleString('en-US', {
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

  const [data, setData] = useState([])
  async function fetchData() {
    const data = await axios.get('tees.json')
    setData(data.data.tees[0].holes)
  }
  // Performing search on scoreboard tees and players names
  const globalSearch = (value: any) => {
    const query = queryClient.getQueryData<Query<any>>('slotsQuery')
    //@ts-ignore
    if (query?.data) {
      //@ts-ignore
      const filteredData = query?.data.filter((item: any) => {
        item = new Date(item).toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        return item.toLowerCase().includes(value.toLowerCase())
      })

      queryClient.setQueryData('slotsQuery', {data: filteredData})
    }
  }
  const handleInputChange = (e: any) => {
    globalSearch(e.target.value)
    if (e.target.value === '') {
      queryClient.invalidateQueries('slotsQuery')
    }
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
              <Input
                placeholder='Search tee time'
                type='text'
                onChange={handleInputChange}
                allowClear
              />
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
  )
}

export {ScoreBoardMain}
