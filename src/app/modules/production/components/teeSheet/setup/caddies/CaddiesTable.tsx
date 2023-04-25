import {Button, Form, Input, Modal, Space, Table, message} from 'antd'
import {Link, Route, Routes} from 'react-router-dom'
import {useState} from 'react'
import {KTCard, KTCardBody, KTSVG} from '../../../../../../../_metronic/helpers'
import {QueryClient, useMutation, useQuery, useQueryClient} from 'react-query'
import {getAllCaddiesApi, updateCaddyApi} from '../../../Requests'
import {render} from 'react-dom'

export function CaddiesTable() {
  const [loading, setLoading] = useState(false)
  const {data: getAllCaddies, isLoading} = useQuery('caddiesQuery', ()=> getAllCaddiesApi())
  const {mutate: updateCaddy} = useMutation((data: any) => updateCaddyApi(data))
  const [editCaddyDetails, seteditCaddyDetails] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const  queryClient=useQueryClient()
  const [form] = Form.useForm()
  const columns: any = [
    {
      title: 'Picture',
      dataIndex: 'picture',
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
      dataIndex: 'code',
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
      dataIndex: 'fname',
    },
    {},
    {
      title: 'Last Name',
      sorter: (a: any, b: any) => a.downTime - b.downTime,
      dataIndex: 'lname',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Actions',
      render: (record: any) => {
        return (
          <>
            <Space size='middle'>
              <a
                href='#'
                className='btn btn-light-warning btn-sm'
                onClick={() => editCaddy(record)}
              >
                Update
              </a>
              <a href='#' className='btn btn-light-primary btn-sm'>
                Activate
              </a>
              <a href='#' className='btn btn-light-danger btn-sm'>
                Deactivate
              </a>
            </Space>
          </>
        )
      },
    },
  ]
  const editCaddy = (record: any) => {
    setIsEditing(true)
    form.setFieldsValue({
      id: record.id,
      fname: record.fname,
      lname: record.lname,
      email: record.email,
      gender: record.gender,
      picture: record.picture,
      code: record.code,
      address: record.address,
    })
    // const Caddy=getAllCaddies?.data.filter()
  }
  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  }

  const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
  }
  // method to update caddies
  function onFinish(values: any): void {
    Modal.confirm({
      title: 'Are you sure you want to save the records?',
      content: 'This action cannot be undone',
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk() {
        updateCaddy(values, {
          onSuccess: () => {
            setIsEditing(false)

            message.success('Member updated successfully')
            form.resetFields()
             queryClient.invalidateQueries('caddiesQuery')
          },
          onError: (error: any) => {
            message.error('Failed to update member. Kindly, Check email and code if not already exists')
            console.log(error.message);
            
          },
        })
      },
    })
  }

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
        <Table
          className='table-responsive'
          columns={columns}
          bordered
          loading={loading}
          dataSource={getAllCaddies?.data}
        />
        <Modal
          title='Edit Caddy'
          open={isEditing}
          onCancel={() => setIsEditing(false)}
          closable={true}
          footer={null}
        >
          <Form
            style={{maxWidth: 600}}
            form={form}
            disabled={false}
            initialValues={editCaddyDetails}
            onFinish={onFinish}
            {...layout}
            name='control-hooks'
          >
            <Form.Item hidden={true} name={'id'} hasFeedback>
              <Input value='' disabled={false} type='hidden' />
            </Form.Item>
            <Form.Item
              label='Code'
              rules={[{required: true, message: 'Please input your code!'}]}
              name={'code'}
              hasFeedback
            >
              <Input value='' disabled={false} style={{color: 'gray', fontSize: '0.9rem'}} />
            </Form.Item>
            <Form.Item
              label='First Name'
              rules={[{required: true, message: 'Please input your First Name!'}]}
              name={'fname'}
              hasFeedback
            >
              <Input value='' disabled={false} style={{color: 'gray', fontSize: '0.9rem'}} />
            </Form.Item>
            <Form.Item
              label='Last Name'
              rules={[{required: true, message: 'Please input your Last Name!'}]}
              name={'lname'}
              hasFeedback
            >
              <Input
                placeholder='Enter Last Name'
                value=''
                style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
              />
            </Form.Item>

            <Form.Item
              label='Email'
              rules={[{required: true, message: 'Please input your Email!'}]}
              name={'email'}
              hasFeedback
            >
              <Input
                placeholder='Enter Email'
                value=''
                style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
              />
            </Form.Item>
            <Form.Item
              label='Gender'
              rules={[{required: true, message: 'Please input your Gender!'}]}
              name={'gender'}
              hasFeedback
            >
              <Input
                placeholder='input placeholder'
                value={editCaddyDetails?.gender}
                style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
              />
            </Form.Item>
            <Form.Item
              label='Addrdess'
              rules={[{required: true, message: 'Please input your address!'}]}
              name={'address'}
              hasFeedback
            >
              <Input
                placeholder='input placeholder'
                value=''
                style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
              />
            </Form.Item>

            <Form.Item
              label='Picture'
              // rules={[{required: true, message: 'Please upload file!'}]}
              name={'picture'}
              //hasFeedback
            >
              <Input
                placeholder='Enter Satus'
                value=''
                type='file'
                style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
              />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button key='back' onClick={() => setIsEditing(false)} className='me-1'>
                Cancel
              </Button>
              <Button key='submit' type='primary' htmlType='submit'>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </KTCardBody>
    </KTCard>
  )
}
