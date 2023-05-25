import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import './formStyle.css'
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface'
import {UploadOutlined} from '@ant-design/icons'
import {Button, Form, Input, message, Select, Upload} from 'antd'
import {useMutation, useQueryClient} from 'react-query'
import {postMember} from '../../Requests'
import {useForm} from 'antd/es/form/Form'
import axios from 'axios'
import {API_URL} from '../../../../../urls'

const Add = () => {
  // const [formData, setFormData] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [tempImage, setTempImage] = useState<any>()
  // const handleChange = (event: any) => {
  //   setFormData({...formData, [event.target.name]: event.target.value})
  // }
  // const {mutate: updateCaddy} = useMutation((data: any) => updateCaddyApi(data))
  // const {mutate: addMember} = useMutation((data: any) => postMember(data))

  const queryClient = useQueryClient()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onFileChange = (e: any) => {
    // Update the state
    setTempImage(e.target.files[0])
  }

  const handleSubmit = (values: any) => {
    let formData = new FormData()
    formData.append('code', values.code)
    formData.append('fname', values.fname)
    formData.append('lname', values.lname)
    formData.append('phone', values.phone)
    formData.append('gender', values.gender)
    formData.append('dateOfBirth', values.dateOfBirth)
    formData.append('playerHandicap', values.playerHandicap)
    formData.append('ggaid', values.ggaid)
    formData.append('status', 'active')
    formData.append('email', values.email)
    formData.append('imageFile', tempImage)

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    axios
      .post(`${API_URL}/members`, formData, config)
      .then((response) => {
        // Handle success
       
        message.success('Member added successfully')
        queryClient.invalidateQueries('membersQuery')
        form.resetFields()
        setSubmitLoading(false)
      })
      .catch((error) => {
        // Handle error
        message.error(error.message).then((r) => console.log('r', r))
        console.log(error.message)
        setSubmitLoading(false)
      })
    // Pass the config object directly
  }
  useEffect(() => {}, [])

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
  const [form] = useForm()
  const Option = Select.Option
  return (
    <div
      className='col-12'
      style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <Link to='/register'>
        <a style={{fontSize: '16px', fontWeight: '500'}} className='btn btn-primary btn-sm mb-7'>
          Back to Members
        </a>
      </Link>
      <Form onFinish={handleSubmit} form={form} name='control-hooks' title={'Add Member'}>
        <div>
          <div className='row mb-0'>
            <div className='col-6 mb-7'>
              {/* <Upload
                listType='picture-card'
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
              >
                <UploadOutlined />
              </Upload> */}
              <Form.Item name='file'>
                <input
                  className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
                  onChange={onFileChange}
                  type='file'
                />
              </Form.Item>
            </div>
          </div>
          <div className='row mb-0'>
            <div className='col-6 mb-7'>
              <label htmlFor='exampleFormControlInput1' className='required form-label'>
                Membership ID
              </label>
              <Form.Item name='code'>
                <Input type='text' required={true} className='form-control form-control-solid' />
              </Form.Item>
            </div>
            <div className='col-6 mb-7'>
              <label htmlFor='exampleFormControlInput1' className='required form-label'>
                First Name
              </label>
              <Form.Item name='fname'>
                <Input type='text' required={true} className='form-control form-control-solid' />
              </Form.Item>
            </div>
          </div>

          <div className='row mb-0'>
            <div className='col-6 mb-7'>
              <label htmlFor='exampleFormControlInput1' className='required form-label'>
                Last Name
              </label>
              <Form.Item name='lname'>
                <Input type='text' required={true} className='form-control form-control-solid' />
              </Form.Item>
            </div>
            <div className='col-6 mb-7'>
              <label htmlFor='exampleFormControlInput1' className='required form-label'>
                Date of Birth
              </label>
              <Form.Item name='dateOfBirth' style={{width:'30%'}}>
                <Input type='date' required={true} className='form-control form-control-solid' />
              </Form.Item>
            </div>
          </div>
          <div className='row mb-0'>
            <div className='col-6 mb-7'>
              <label htmlFor='exampleFormControlInput1' className='form-label'>
                Gender
              </label>
              
              <Form.Item name='gender' style={{width:'30%'}}>
                <Select className={'form-select form-select-solid'}>
                  <Option value='male'>MALE</Option>
                  <Option value='female'>FEMALE</Option>
                </Select>
              </Form.Item>
            </div>
            <div className='col-6 mb-7'>
              <label htmlFor='exampleFormControlInput1' className='required form-label'>
                Phone Number
              </label>
              <Form.Item name='phone'>
                <Input type='number' required={true} className='form-control form-control-solid' />
              </Form.Item>
            </div>
          </div>
          <div className='row mb-0'>
            <div className='col-6 mb-7'>
              <label htmlFor='exampleFormControlInput1' className='required form-label'>
                Email
              </label>
              <Form.Item name='email'>
                <Input type='email' required={true} className='form-control form-control-solid' />
              </Form.Item>
            </div>
            <div className='col-6 mb-7'>
              <label htmlFor='exampleFormControlInput1' className='required form-label'>
                Player Handicap
              </label>
              <Form.Item name='playerHandicap'>
                <Input type='text' required={true} className='form-control form-control-solid' />
              </Form.Item>
            </div>
          </div>

          <div className='row mb-0'>
            <div className='row mb-0'>
              <div className='col-6 mb-7'>
                <label htmlFor='exampleFormControlInput1' className='required form-label'>
                  GGA ID#
                </label>
                <Form.Item name='ggaid'>
                  <Input type='text' required={true} className='form-control form-control-solid' />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        <Button type='primary' key='submit' htmlType='submit' loading={submitLoading}>
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default Add
