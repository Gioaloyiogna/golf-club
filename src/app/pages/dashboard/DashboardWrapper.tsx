/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {MixedWidget11} from '../../../_metronic/partials/widgets'
import {BarChart} from './BarChart'
import {DashboardTable} from './dashboardTable/CycleDetailsList'
import {KTCard, KTCardBody, KTSVG} from '../../../_metronic/helpers'
import {Button, Card, Input, Modal, Space, Table} from 'antd'
import {Link} from 'react-router-dom'
import {
  CheckSquareOutlined,
  CloseSquareFilled,
  DropboxSquareFilled,
  MinusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {BarChartPerDays} from './BarChartPerDays'
import DevexpresExpressDashboard from './DeveExpressDashboard'
import {useQueries, useQuery} from 'react-query'
import {
  getAllCaddiesApi,
  getAllCaddiesTees,
  getPlayerMembers,
  getPlayers,
} from '../../modules/production/components/Requests'
import {AnyARecord} from 'dns'

const DashboardPage: FC = () => {
  // array to store caddies details to be display on the modal
  const [caddyModalDatails, setCaddyModalDetails] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  //one week ago days
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const nextTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  // getting all caddies per tees
  const {data: allCaddies} = useQuery('allCaddiesQueries', getAllCaddiesTees)
  // getting all caddies data
  const {data: caddiesData} = useQuery('cadddyDataQuery', getAllCaddiesApi)
  // getting all players
  const {data: playersData} = useQuery('playersDataQuery', () => getPlayers())
  // getting caddies data when tees are less than one week
  const caddiesDataArray: any = []
  const caddiesFilteredData: any = []
  const playersFilteredData: any = []
  const playersDataArray: any = []
  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'fullname',
      sorter: (a: any, b: any) => {
        if (a.txmodel > b.txmodel) {
          return 1
        }
        if (a.txmodel < b.txmodel) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },

    {
      title: 'Player Type',
      dataIndex: 'membertype',
      sorter: (a: any, b: any) => a.downTime - b.downTime,
    },

    {
      title: 'Tees (Last 30 days)',
      render: (record: any) => {
        return currentPlayersArray[record.key].map((tee: any, index: any) => {
          index++
          const newDate = new Date(tee.teeTime)
          
          return (
            <div key={tee.id}>
              <label className='d-flex'>
                <div className='d-flex justify-items-center'>
                  <p className='fs-7 m-0 pl-2'>
                    {index}
                    <MinusOutlined />
                    {newDate.toLocaleDateString('en-US', {
                      day: 'numeric',
                      weekday: 'long',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
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
              <a href='#' className='btn btn-light-warning btn-sm'>
                Score
              </a>
            </Space>
          </>
        )
      },
    },
  ]
  const caddiesColumns: any = [
    {
      title: 'First Name',
      dataIndex: 'fname',
      sorter: (a: any, b: any) => {
        if (a.txmodel > b.txmodel) {
          return 1
        }
        if (a.txmodel < b.txmodel) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Last Name',
      dataIndex: 'lname',
      sorter: (a: any, b: any) => a.downTime - b.downTime,
    },

    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Recent Tees',
      render: (record: any) => {
        // console.log(currentCaddyArray[record.key]);

        return currentCaddyArray[record.key].map((tee: any) => {
          const newDate = new Date(tee.teeTime).toISOString().split('T')[0]
          const today = new Date(Date.now()).toISOString().split('T')[0]
          // const formattedTodayDate = today.toLocaleDateString('en-US', {
          //   weekday: 'short',
          //   month: 'short',
          //   day: 'numeric',
          //   year: 'numeric',
          // })
          // const formattedItemDate = newDate.toLocaleDateString('en-US', {
          //   weekday: 'short',
          //   month: 'short',
          //   day: 'numeric',
          //   year: 'numeric',
          // })
          if (newDate == today) {
            return (
              <div key={tee.id}>
                <label className='d-flex'>
                  <div className='d-flex justify-items-center'>
                    <p className='fs-7 m-0 pl-2'>
                      {new Date(tee.teeTime).toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </p>
                  </div>
                </label>
              </div>
            )
          }
        })
      },
    },
    {
      title: 'Action',
      render: (record: any) => {
        // console.log(currentCaddyArray[record.key]);

        // return Object.entries(currentCaddyArray).forEach(([key, value]) => {
        //   const data = caddiesData?.data.filter((item: any) => {
        //     return item.id == key
        //   })
        //   console.log('datata', data, key, caddiesData?.data)

        //   caddiesDataArray.push({
        //     fname: data[0].fname,
        //     lname: data[0].lname,
        //     email: data[0].email,
        //     key: key,
        //   })
        // })
        return (
          <>
            <Space size='middle'>
              <Button
                className='btn btn-light-warning btn-sm'
                onClick={() => caddyDetails(record.key)}
              >
                Tees
              </Button>
            </Space>
          </>
        )
      },
    },
  ]

  // display modal data

  const caddyDetails = (key: number) => {
    setCaddyModalDetails(currentCaddyArray[key])
    setModalOpen(true)
  }
  // caddy tees modal

  allCaddies?.data.filter((item: any) => {
    const itemDate = new Date(item.teeTime).toISOString().split('T')[0]
    const today = new Date(Date.now()).toISOString().split('T')[0]

    if (itemDate <= nextTwoWeeks.toISOString().split('T')[0] && itemDate >= today) {
      console.log(itemDate)
      caddiesFilteredData.push(item)
    }
  })
  const currentCaddyArray = caddiesFilteredData?.reduce((groups: any, item: any) => {
    const {caddyId} = item
    if (!groups[caddyId]) {
      groups[caddyId] = []
    }
    groups[caddyId].push(item)
    return groups
  }, {})

  Object.entries(currentCaddyArray).forEach(([key, value]) => {
    const data = caddiesData?.data.filter((item: any) => {
      return item.id == key
    })

    if (data) {
      caddiesDataArray.push({
        fname: data[0]?.fname,
        lname: data[0]?.lname,
        email: data[0]?.email,
        key: key,
      })
    }
  })
  // filtering caddies
  allCaddies?.data.filter((item: any) => {
    const itemDate = new Date(item.teeTime).toISOString().split('T')[0]
    const today = new Date(Date.now()).toISOString().split('T')[0]

    if (itemDate <= nextTwoWeeks.toISOString().split('T')[0] && itemDate >= today) {
      caddiesFilteredData.push(item)
    }
  })
  // filtering players
  playersData?.data.filter((item: any) => {
    const itemDate = new Date(item.teeTime).toISOString().split('T')[0]
    const today = new Date(Date.now()).toISOString().split('T')[0]
    if (itemDate >= last30Days && itemDate < today) {
      playersFilteredData.push(item)
    }
  })
  const currentPlayersArray = playersFilteredData?.reduce((groups: any, item: any) => {
    const {playerEmail} = item

    if (!groups[playerEmail.trim()]) {
      groups[playerEmail.trim()] = []
    }
    groups[playerEmail.trim()].push(item)
    return groups
  }, {})

  Object.entries(currentPlayersArray).forEach(([key, value]: any) => {
    playersDataArray.push({
      fullname: value[0]?.playerName,
      email: value[0]?.playerEmail,
      membertype: value[0]?.playerType,
      key: key,
    })
  })

  return (
    <>
      <Modal
        title='Tees Availability(Next 14 Days)'
        style={{top: 20}}
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        cancelButtonProps={{style: {display: 'none'}}}
      >
        {caddyModalDatails?.map((item: any) => {
          const tee = new Date(item.teeTime).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
          return (
            <>
              <p>{tee}</p>
            </>
          )
        })}
      </Modal>
      {/* begin::Row */}
      <div className='row gy-5 g-xl-8'>
        <DevexpresExpressDashboard />
        {/* <div className='col-xl-6'>
          <BarChart
            className='card-xxl-stretch mb-5 mb-xl-8'
            chartColor='primary'
            chartHeight='200px'
            barcolor='#EAE509FF'
          />
        </div> */}
      </div>

      <div className='row gy-5 g-xl-8 bg-white mt-1 mx-0'>
        {/* <div className='col-xl-6'>
          <Card title={<>PLAYERS</>} bordered={false}>
            <div className='d-flex justify-content-between'>
              <Space style={{marginBottom: 16}}>
                <Input placeholder='Enter Search Text' type='text' allowClear />
                <Button type='primary'>Search</Button>
              </Space>
            </div>
            <Table className='table-responsive' rowKey={'id'} columns={columns} bordered />
          </Card>
        </div> */}
        <div className='col-xl-12'>
          <Card title={<> CADDIES AVAILABILITY</>} bordered={false}>
            <div className='d-flex justify-content-between'>
              <Space style={{marginBottom: 16}}>
                <Input placeholder='Enter Search Text' type='text' allowClear />
                <Button type='primary'>Search</Button>
              </Space>
            </div>
            <Table
              className='table-responsive'
              rowKey={'id'}
              columns={caddiesColumns}
              dataSource={caddiesDataArray}
              bordered
            />
          </Card>
        </div>
      </div>
      <div className='row gy-5 g-xl-8 bg-white mt-1 mx-0'>
        <div className='col-xl-12'>
          <Card title={<>PLAYERS</>} bordered={false}>
            <div className='d-flex justify-content-between'>
              <Space style={{marginBottom: 16}}>
                <Input placeholder='Enter Search Text' type='text' allowClear />
                <Button type='primary'>Search</Button>
              </Space>
            </div>
            <Table
              className='table-responsive'
              rowKey={'id'}
              columns={columns}
              dataSource={playersDataArray}
              bordered
            />
          </Card>
        </div>
        {/* <div className='col-xl-6'>
          <Card title={<> CADDIES AVAILABILITY</>} bordered={false}>
            <div className='d-flex justify-content-between'>
              <Space style={{marginBottom: 16}}>
                <Input placeholder='Enter Search Text' type='text' allowClear />
                <Button type='primary'>Search</Button>
              </Space>
            </div>
            <Table
              className='table-responsive'
              rowKey={'id'}
              columns={caddiesColumns}
              dataSource={caddiesDataArray}
              bordered
            />
          </Card>
        </div> */}
      </div>
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
