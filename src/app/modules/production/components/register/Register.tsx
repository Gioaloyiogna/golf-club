import {
  Button,
  Dropdown,
  Input,
  MenuProps,
  Space,
  Table,
  Modal,
  message,
  Form,
  Select,
  UploadFile,
} from 'antd'
import {useEffect, useState} from 'react'
import {Link, Route, Routes} from 'react-router-dom'
import {KTCard, KTCardBody, KTSVG, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import Add from './add/Registration'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import {Query, QueryClient, useMutation, useQuery, useQueryClient} from 'react-query'
import {getMembers} from '../Requests'
import {id} from 'date-fns/locale'
import {
  CheckOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import {API_URL, PIC_URL} from '../../../../urls'

const Register = () => {
  // const [gridData, setGridData] = useState([])

  const {data: members, isLoading} = useQuery('membersQuery', () => getMembers())
  const [messageApi, contextHolder] = message.useMessage()
  const [isEditing, setIsEditing] = useState(false)
  const [editMemberDetails, setEditMemberDetails] = useState<any>(null)
  const [modalPic, setModalPic] = useState<string>()
  const [profilePic, setProfilePic] = useState<any>()
  const [profilePicFile, setprofilePicFile] = useState<any>()
  const {mutate: upDateMember} = useMutation((data: any) =>
    axios.put(`${API_URL}/members/${data.id}`, data)
  )
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  // const [searchText, setSearchText] = useState('')
  // let [filteredData] = useState([])
  console.log('Members', members)
  const onMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e)
  }
  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  }

  const tailLayout = {
    wrapperCol: {offset: 8, span: 16},
  }
  const items = [
    {
      key: '1',
      label: 'Activate',
    },
    {
      key: '2',
      label: 'Deactivate',
    },
    {
      key: '3',
      label: 'Suspend',
    },
    {
      key: '4',
      label: 'Edit',
    },
  ]
  const columns: any = [
    {
      title: 'Picture',
      sorter: (a: any, b: any) => a.id - b.id,
      render: (record: any) => (
        <img
          src={
            record.picture
              ? `${PIC_URL}/member/${record.picture}`
              : `${toAbsoluteUrl('/media/avatars/blank.png')}`
          }
          alt='Picture'
          style={{width: '50px'}}
        />
      ),
    },

    {
      title: 'Membership ID',
      sorter: (a: any, b: any) => {
        if (a.txmanf > b.txmanf) {
          return 1
        }
        if (b.txmanf > a.txmanf) {
          return -1
        }
        return 0
      },
      dataIndex: 'membershipId',
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
      dataIndex: 'fname',
    },
    {
      title: 'Last Name',
      sorter: (a: any, b: any) => a.downTime - b.downTime,
      dataIndex: 'lname',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'DOB',
      dataIndex: 'dateOfBirth',
    },
    {
      title: 'Player Handicap',
      dataIndex: 'playerHandicap',
    },
    {
      title: 'GGA ID#',
      dataIndex: 'ggaid',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Action',
      render: (record: any) => {
        return (
          <>
            <Space size='middle'>
              <a
                href='#'
                className='btn btn-light-warning btn-sm'
                onClick={() => editMember(record)}
              >
                Update
              </a>
              <a
                href='#'
                className='btn btn-light-primary btn-sm'
                onClick={() => activateUser(record.id)}
              >
                Activate
              </a>
              <a
                href='#'
                className='btn btn-light-danger btn-sm'
                onClick={() => deactivateUser(record.id)}
              >
                Deactivate
              </a>
            </Space>
          </>
        )
      },
    },
  ]

  const globalSearch = (value: any) => {
    const query = queryClient.getQueryData<Query<any>>('membersQuery')
    //@ts-ignore
    if (query?.data) {
      //@ts-ignore
      const filteredData = query?.data.filter((item: any) => {
        return (
          item.fname.toLowerCase().includes(value.toLowerCase()) ||
          item.lname.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase())
        )
      })
      console.log('filteredData', filteredData)
      queryClient.setQueryData('membersQuery', {data: filteredData})
    }
  }
  const handleInputChange = (e: any) => {
    globalSearch(e.target.value)
    if (e.target.value === '') {
      queryClient.invalidateQueries('membersQuery')
    }
  }
  //Activating members
  const activateUser = (id: any) => {
    Modal.confirm({
      okText: 'Yes',
      okType: 'danger',
      title: 'Are you sure, you want to activate Member?',
      onOk: () => {
        axios.post(`${API_URL}/ActivateMember?id=${id}`).then((response) => {
          if (response.status == 200) {
            messageApi.success('Member was successfully activated!')
            queryClient.invalidateQueries('membersQuery')
          }
        })
      },
    })
  }
  //deactivating members
  const deactivateUser = (id: any) => {
    Modal.confirm({
      okText: 'Yes',
      okType: 'danger',
      title: 'Are you sure, you want to deactivate Member?',
      onOk: () => {
        axios.post(`${API_URL}/DeactivateMember?id=${id}`).then((response) => {
          if (response.status == 200) {
            messageApi.success('Member was successfully deactivated!')
            queryClient.invalidateQueries('membersQuery')
          }
        })
      },
    })
  }
  // handle submit form

  const submitForm = () => {
    // form.validateFields()
    // .then(values => {
    // })
    // .catch(error => console.log(error));
  }

  const editMember = (record: any) => {
    // setEditMemberDetails({...record})
    form.setFieldsValue({
      id: record.id,
      fname: record.fname,
      lname: record.lname,
      email: record.email,
      gender: record.gender,
      DOB: record.DOB,
      playerHandicap: record.playerHandicap,
      ggaid: record.ggaid,
      status: record.status,
      membershipId: record.membershipId,
      phone: record.phone,
      // picture: record.picture,
    })
    setModalPic(record.picture)
    // form.resetFields()
    queryClient.invalidateQueries('membersQuery')
    setIsEditing(true)
  }
  //   {
  //     "id": 111,
  //     "fname": "string",
  //     "lname": "string",
  //     "email": "yassinehamadou1@mail.com",
  //     "gender": "string",
  //     "DOB": "2023-05-03",
  //     "playerHandicap": "34",
  //     "ggaid": "string",
  //     "status": "Inactive",
  //     "picture": "C:\\fakepath\\thato.jpg"
  // }
  const onFinish = (values: any) => {
    //  values.ImageFile=profilePicFile ? profilePicFile : null
    // console.log(values);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    const formData = new FormData()
    formData.append('Id', values.id)
    formData.append('MembershipId', values.membershipId)
    formData.append('Fname', values.fname)
    formData.append('Lname', values.lname)
    formData.append('Email', values.email)
    formData.append('DateOfBirth', values.DOB)
    formData.append('PlayerHandicap', values.playerHandicap)
    formData.append('Ggaid', values.ggaid)
    formData.append('Status', values.status)
    formData.append('Phone', values.phone)
    formData.append('Gender', values.gender)
    formData.append('ImageFile', profilePicFile ? profilePicFile : null)

    console.log('formdat', Object.fromEntries(formData))
    axios
      .put(`${API_URL}/members/${values.id}`, formData, config)
      .then((response) => {
        // Handle success
        message.info('Member Updated successfully')
        queryClient.invalidateQueries('membersQuery')
        form.resetFields()
        setIsEditing(false)
        setModalPic('')
        setProfilePic('')
      })
      .catch((error) => {
        message.info('Updating member failed. Email, Ggaid or Membership Id already taken.')
      })

    // Modal.confirm({
    //   title: 'Are you sure you want to save the records?',
    //   content: 'This action cannot be undone',
    //   okText: 'Yes',
    //   okType: 'primary',
    //   cancelText: 'No',
    //   onOk() {
    //     upDateMember(values, {
    //       onSuccess: () => {
    //         setIsEditing(false)

    //         message.success('Member updated successfully')
    //         form.resetFields()
    //         queryClient.invalidateQueries('membersQuery')
    //       },
    //       onError: (error: any) => {
    //         message.error('Failed to update Member')
    //         console.log(error.message);

    //       },
    //     })
    //   },
    // })
  }
  // handle profile image on change
  const handleProfileImage = async (e: any) => {
    let file = e.target.files[0]
    const base64 = await convertToBase64(file)
    setProfilePic(base64)
    setprofilePicFile(e.target.files[0])
    setModalPic('')
    e.target.files[0] = ''
  }
  const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      if (!file) {
        message.info('No file selected')
      } else {
        fileReader.readAsDataURL(file)
        fileReader.onload = () => {
          resolve(fileReader.result)
        }
        fileReader.onerror = (error) => {
          reject(error)
        }
      }
    })
  }
  const closeModal = () => {
    setModalPic('')
    setProfilePic('')
    setIsEditing(false)
  }

  // to preview the uploaded file
  // const onPreview = async (file: UploadFile) => {
  //   let src = file.url as string
  //   if (!src) {
  //     src = await new Promise((resolve) => {
  //       const reader = new FileReader()
  //       reader.readAsDataURL(file.originFileObj as RcFile)
  //       reader.onload = () => resolve(reader.result as string)
  //     })
  //   }
  //   const image = new Image()
  //   image.src = src
  //   const imgWindow = window.open(src)
  //   imgWindow?.document.write(image.outerHTML)
  // }
  return (
    <Routes>
      {/*index*/}
      <Route
        path='/'
        element={
          <>
            {contextHolder}
            <PageTitle>Members</PageTitle>
            <KTCard>
              <KTCardBody>
                <div className='d-flex justify-content-between'>
                  <Space style={{marginBottom: 16}}>
                    <Input
                      placeholder='Enter Search Text'
                      onChange={handleInputChange}
                      type='text'
                      allowClear
                    />
                    <Button type='primary'>Search</Button>
                  </Space>
                  <Space style={{marginBottom: 16}}>
                    <Link to='add'>
                      <button type='button' className='btn btn-primary me-3'>
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr075.svg'
                          className='svg-icon-2'
                        />
                        Add
                      </button>
                    </Link>
                  </Space>
                </div>
                <Table
                  className='table-responsive'
                  rowKey={'id'}
                  columns={columns}
                  bordered
                  loading={isLoading}
                  dataSource={members?.data}
                />
                <Modal
                  title='Edit Member'
                  open={isEditing}
                  onCancel={closeModal}
                  closable={true}
                  footer={null}
                >
                  <Form
                    style={{maxWidth: 600}}
                    form={form}
                    disabled={false}
                    initialValues={editMemberDetails}
                    onFinish={onFinish}
                    {...layout}
                    name='control-hooks'
                  >
                    <Form.Item hidden={true} name={'id'} hasFeedback>
                      <Input value={editMemberDetails?.id} disabled={false} type='hidden' />
                    </Form.Item>
                    <Form.Item
                      label='First Name'
                      rules={[{required: true, message: 'Please input your First Name!'}]}
                      name={'fname'}
                      hasFeedback
                    >
                      <Input
                        value={editMemberDetails?.fname}
                        disabled={false}
                        style={{color: 'gray', fontSize: '0.9rem'}}
                      />
                    </Form.Item>
                    <Form.Item
                      label='Last Name'
                      rules={[{required: true, message: 'Please input your Last Name!'}]}
                      name={'lname'}
                      hasFeedback
                    >
                      <Input
                        placeholder='Enter Last Name'
                        value={editMemberDetails?.lname}
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
                        value={editMemberDetails?.email}
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                      />
                    </Form.Item>
                    <Form.Item
                      label='MemberShip'
                      rules={[{required: true, message: 'Please input your membership id!'}]}
                      name={'membershipId'}
                      hasFeedback
                    >
                      <Input
                        placeholder='Enter Membership'
                        value={editMemberDetails?.email}
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                      />
                    </Form.Item>
                    <Form.Item
                      name={'gender'}
                      label='Gender'
                      rules={[{required: true, message: 'Please input your Gender!'}]}
                      style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                    >
                      <Select
                        placeholder='Select Gender'
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                        // onChange={(value) => memberOnChange(value)}
                        // onChange={handleOnChange}
                        className='w-100 mb-2'
                        options={[
                          {value: 'Male', label: 'Male'},
                          {value: 'Female', label: 'Female'},
                        ]}
                      ></Select>
                    </Form.Item>

                    {/* <Form.Item
                      label='Gender'
                      rules={[{required: true, message: 'Please input your Gender!'}]}
                      name={'gender'}
                      hasFeedback
                    >
                      <Input
                        placeholder='input placeholder'
                        value={editMemberDetails?.gender}
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                      />
                    </Form.Item> */}
                    <Form.Item
                      label='Date OF Birth'
                      rules={[{required: true, message: 'Please input your date of birth!'}]}
                      name={'DOB'}
                      hasFeedback
                    >
                      <Input
                        placeholder='Enter Last Name'
                        defaultValue={editMemberDetails?.DOB}
                        type='date'
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                      />
                    </Form.Item>
                    <Form.Item
                      label='Player Handicap'
                      rules={[{required: true, message: 'Please input your Last Name!'}]}
                      name={'playerHandicap'}
                      hasFeedback
                    >
                      <Input
                        placeholder='Enter Last Player Handicap'
                        value={editMemberDetails?.playerHandicap}
                        type='number'
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                      />
                    </Form.Item>
                    <Form.Item label='Phone' name={'phone'} hasFeedback>
                      <Input
                        placeholder='Enter Phone'
                        value={editMemberDetails?.playerHandicap}
                        type='number'
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                      />
                    </Form.Item>
                    <Form.Item
                      label='GGAID'
                      rules={[{required: true, message: 'Please input your GGAID!'}]}
                      name={'ggaid'}
                      hasFeedback
                    >
                      <Input
                        placeholder='Enter your GGAID'
                        value={editMemberDetails?.ggaid}
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                      />
                    </Form.Item>
                    <Form.Item
                      label='Status'
                      rules={[{required: true, message: 'Please enter your status!'}]}
                      name={'status'}
                      hasFeedback
                    >
                      <Input
                        placeholder='Enter Satus'
                        value={editMemberDetails?.status}
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                      />
                    </Form.Item>
                    <div style={{paddingLeft: '33%', paddingBottom: '1rem'}}>
                      {modalPic && (
                        <img src={`${PIC_URL}/member/${modalPic}`} alt='' style={{width: '50px'}} />
                      )}
                      {profilePic && <img src={profilePic} alt='' style={{width: '50px'}} />}
                      {!modalPic && !profilePic && (
                        <img
                          src={toAbsoluteUrl('/media/avatars/blank.png')}
                          alt=''
                          style={{width: '50px'}}
                        />
                      )}
                    </div>
                    <Form.Item
                      label='Profile Picture'
                      // rules={[{required: true, message: 'Please upload file!'}]}
                      name={'ImageFile'}
                      //hasFeedback
                    >
                      <Input
                        value={editMemberDetails?.picture}
                        type='file'
                        style={{color: 'gray', fontSize: '0.9rem', fontWeight: 'lighter'}}
                        onChange={handleProfileImage}
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
          </>
        }
      />
      {/*add*/}
      <Route
        path='add'
        element={
          <>
            <PageTitle>Add new member</PageTitle>
            <Add />
          </>
        }
      />
    </Routes>
  )
}

export {Register}
