import {Button, Input, Space, Table} from 'antd'
import {Link, Route, Routes} from 'react-router-dom'
import {useState} from 'react'
import {KTCard, KTCardBody, KTSVG} from '../../../../../../../_metronic/helpers'
import { useQuery } from 'react-query'
import { getAllCaddiesApi } from '../../../Requests'
import { render } from 'react-dom'


const columns: any = [
  {
    title: 'Picture',
    dataIndex: 'picture'
  },
  {
    title: 'Code',
    sorter: (a: any, b: any) => {
      if (a.txmanf > b.txmanf) {
        return 1
      }
      if (b.txmanf > a.txmanf) {
        return -1
      }
      return 0
    },
    dataIndex: 'code'
  },
  {
    title: 'Fist Name',
    sorter: (a: any, b: any) => {
      if (a.txmodel > b.txmodel) {
        return 1
      }
      if (a.txmodel < b.txmodel) {
        return -1
      }
      return 0
    },
    dataIndex: 'fname'
  },
  {},
  {
    title: 'Last Name',
    sorter: (a: any, b: any) => a.downTime - b.downTime,
    dataIndex: 'lname'
  },
  {
    title: 'Email',
    dataIndex: 'email'
  },
  {
    title: 'Phone',
    dataIndex: 'phone'
  },
  {
    title: 'Address',
    dataIndex: 'address'
  },
  {
    title: 'Gender',
    dataIndex: 'gender'
  },
  {
    title: 'Actions',
    render: (record:any)=>{
      return (
        <>
        <Space size='middle'>
        <a href="#" className='btn btn-light-warning btn-sm'>Update</a>
        <a href="#" className='btn btn-light-primary btn-sm'>Activate</a>
        <a href="#" className='btn btn-light-danger btn-sm'>Deactivate</a>
      </Space>
        </>
      )
      }
      
  }
  
]

export function CaddiesTable() {
  const [loading, setLoading] = useState(false)
  const {data:getAllCaddies, isLoading}=useQuery('caddiesQuery', ()=>getAllCaddiesApi())
  console.log(getAllCaddies);
  

  return (
    <KTCard>
      <KTCardBody>
        <div className='d-flex justify-content-between'>
          <Space style={{marginBottom: 16}}>
            <Input
              placeholder='Enter Search Text'
              // onChange={handleInputChange}
              type='text'
              allowClear
              // value={searchText}
            />
            <Button type='primary'>Search</Button>
          </Space>
          <Space style={{marginBottom: 16}}>
            <Link to='add'>
              <button type='button' className='btn btn-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>
            </Link>
          </Space>
        </div>
        <Table    className='table-responsive' columns={columns} bordered loading={loading} dataSource={getAllCaddies?.data} />
      </KTCardBody>
    </KTCard>
  )
}
