/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {MixedWidget11} from '../../../_metronic/partials/widgets'
import {BarChart} from './BarChart'
import {DashboardTable} from './dashboardTable/CycleDetailsList'
import {KTCard, KTCardBody, KTSVG} from '../../../_metronic/helpers'
import {Button, Card, Input, Space, Table} from 'antd'
import {Link} from 'react-router-dom'
import {
  CheckSquareOutlined,
  CloseSquareFilled,
  DropboxSquareFilled,
  SearchOutlined,
} from '@ant-design/icons'
import { BarChartPerDays } from './BarChartPerDays'

const DashboardPage: FC = () => {
  const columns: any = [
    {
      title: 'GGA ID#',
    },
    {
      title: 'First Name',
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
      sorter: (a: any, b: any) => a.downTime - b.downTime,
    },

    {
      title: 'Tees (Last 30 days)',
    },
    ,
    {
      title: 'Action',
      render: (record: any) => {
        return (
          <>
            <Space size='middle'>
              <a href='#' className='btn btn-light-warning btn-sm'>
                Bookings
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
      sorter: (a: any, b: any) => a.downTime - b.downTime,
    },

    {
      title: 'Email',
    },
    {
      title: 'Recent Bookings',
    },
    {
      title: 'Action',
      render: (record: any) => {
        return (
          <>
            <Space size='middle'>
              <a href='#' className='btn btn-light-warning btn-sm'>
                Bookings
              </a>
            </Space>
          </>
        )
      },
    },
  ]
  return (
    <>
      {/* begin::Row */}
      <div className='row gy-5 g-xl-8'>
        <div className='col-xl-6'>
          <BarChart
            className='card-xxl-stretch mb-5 mb-xl-8'
            chartColor='primary'
            chartHeight='200px'
            barcolor='#EAE509FF'
          />
        </div>
        <div className='col-xl-6'>
          <BarChartPerDays
            className='card-xxl-stretch mb-5 mb-xl-8'
            chartColor='danger'
            chartHeight='200px'
            barcolor='#278119FF'
          />
        </div>
      </div>
      <div className='row gy-5 g-xl-8 bg-white mt-1 mx-0'>
        <div className='col-xl-6'>
          <Card title={<>PLAYERS</>} bordered={false}>
            <div className='d-flex justify-content-between'>
              <Space style={{marginBottom: 16}}>
                <Input placeholder='Enter Search Text' type='text' allowClear />
                <Button type='primary'>Search</Button>
              </Space>
            </div>
            <Table className='table-responsive' rowKey={'id'} columns={columns} bordered />
          </Card>
        </div>
        <div className='col-xl-6'>
          <Card title={<> CADDIES AVAILABILITY</>} bordered={false}>
            <div className='d-flex justify-content-between'>
              <Space style={{marginBottom: 16}}>
                <Input placeholder='Enter Search Text' type='text' allowClear />
                <Button type='primary'>Search</Button>
              </Space>
            </div>
            <Table className='table-responsive' rowKey={'id'} columns={caddiesColumns} bordered />
          </Card>
        </div>
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
