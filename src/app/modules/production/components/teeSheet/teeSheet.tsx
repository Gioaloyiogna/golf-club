import {Button, Card, Col, Form, Input, message, Modal, Row, Select, Space, Table, Tabs} from 'antd'
import axios from 'axios'
import {add} from 'date-fns'
import styles from './Calendar.module.css'
import {Key, useEffect, useRef, useState} from 'react'
import {KTCard, KTCardBody} from '../../../../../_metronic/helpers'
import {API_URL, BASE_URL} from '../../../../urls'
import {Outlet, Route, Routes, useNavigate, useParams} from 'react-router-dom'
import {useForm} from 'antd/es/form/Form'
import {
  CrownOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {DatePickerComponent} from '@syncfusion/ej2-react-calendars'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {id} from 'date-fns/locale'
import {object, string} from 'yup'
import TabPane from 'antd/es/tabs/TabPane'
import {log} from 'console'

import {query} from 'express'
import {
  allGameScheduleApi,
  fetchTees,
  getAllCaddiesApi,
  getAllCaddiesTees,
  getCaddyPerTeeApi,
  getMembers,
  getPlayerMembers,
  getPlayers,
  updateCaddyApi,
  updateCaddySlotsApi,
} from '../Requests'

const TeeSheet = () => {
  const teeSlot = [
    ['T06:00:00Z', 'T06:10:00Z', 'T06:20:00Z', 'T06:30:00Z', 'T06:40:00Z', 'T06:50:00Z'],
    ['T07:00:00Z', 'T07:10:00Z', 'T07:20:00Z', 'T07:30:00Z', 'T07:40:00Z', 'T07:50:00Z'],
    ['T08:00:00Z', 'T08:10:00Z', 'T08:20:00Z', 'T08:30:00Z', 'T08:40:00Z', 'T08:50:00Z'],
    ['T09:00:00Z', 'T09:10:00Z', 'T09:20:00Z', 'T09:30:00Z', 'T09:40:00Z', 'T09:50:00Z'],
    ['T10:00:00Z', 'T10:10:00Z', 'T10:20:00Z', 'T10:30:00Z', 'T10:40:00Z', 'T10:50:00Z'],
    ['T11:00:00Z', 'T11:10:00Z', 'T11:20:00Z', 'T11:30:00Z', 'T11:40:00Z', 'T11:50:00Z'],
    ['T12:00:00Z', 'T12:10:00Z', 'T12:20:00Z', 'T12:30:00Z', 'T12:40:00Z', 'T12:50:00Z'],
    ['T13:00:00Z', 'T13:10:00Z', 'T13:20:00Z', 'T13:30:00Z', 'T13:40:00Z', 'T13:50:00Z'],
    ['T14:00:00Z', 'T14:10:00Z', 'T14:20:00Z', 'T14:30:00Z', 'T14:40:00Z', 'T14:50:00Z'],
    ['T15:00:00Z', 'T15:10:00Z', 'T15:20:00Z', 'T15:30:00Z', 'T15:40:00Z', 'T15:50:00Z'],
    ['T16:00:00Z', 'T16:10:00Z', 'T16:20:00Z', 'T16:30:00Z', 'T16:40:00Z', 'T16:50:00Z'],
  ]
  const isSmallScreen = window.innerWidth < 768
  const columns = [
    {
      title: 'Name',
      dataIndex: 'playerName',
      key: 'playerName',
      // render: () => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'playerEmail',
      key: 'playerEmail',
    },
    {
      title: 'playerType',
      dataIndex: 'playerType',
      key: 'playerType',
    },
    {
      title: 'Action',
      render: (record: any) => {
        return (
          <>
            <div className='d-flex'>
              <Space size='middle'>
                <a
                  href='#'
                  className='btn btn-light-danger btn-sm'
                  onClick={() =>
                    deletePlayer(
                      record.id,
                      record.teeTime,
                      record.memberId,
                      record.playerType,
                      record.playerEmail
                    )
                  }
                >
                  Delete
                </a>
              </Space>
              <Space size='middle' className='mx-1'>
                <a
                  href='#'
                  className='btn btn-light-primary btn-sm'
                  onClick={() => addCaddyPerPlayer(record.memberId)}
                >
                  Caddy
                </a>
              </Space>
            </div>
          </>
        )
      },
    },
  ]

  // caddies columns
  const caddyColumns = [
    {
      title: 'Code',
      dataIndex: 'code',
      // render: () => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'caddyName',
      // render: () => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'caddyEmail',
      // render: () => <a>{text}</a>,
    },

    {
      title: 'Action',
      render: (record: any) => {
        return (
          <>
            <Space size='middle'>
              <a href='#' className='btn btn-light-danger btn-sm'>
                Delete
              </a>
            </Space>
          </>
        )
      },
    },
  ]
  useEffect(() => {
    axios.get(`${API_URL}/members`).then((res) => {
      setMembers(res.data)
    })
  }, [])

  //////////////////////////////
  // Modal state and function //
  //////////////////////////////
  const [open, setOpen] = useState(false)
  const [openCaddy, setOpenCaddy] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [members, setMembers] = useState<any>()
  const {data: allCaddies} = useQuery('caddiesQuery', getAllCaddiesApi)
  const {data: caddyTeesDataApi} = useQuery('allCaddiesQuery', getAllCaddiesTees)
  const {mutate: deletePlayers} = useMutation((values: any) =>
    axios.delete(`${API_URL}/TeeSlots/${values.id}/${values.teeTime}`)
  )
  const {mutate: deleteNonPlayers} = useMutation((values: any) =>
    axios.delete(`${API_URL}/NonMemberTeeSlots/${values.email}/${values.teeTime}`)
  )
  const {data: allTees} = useQuery('tees', fetchTees)
  // const {mutate: addMember} = useMutation((values: any) =>
  //   axios.post(`${API_URL}/TeeSlots`, values)
  // )
  const {mutate: updateCaddy} = useMutation((values: any) => updateCaddySlotsApi(values))
  const {mutate: addNonMember} = useMutation((values: any) =>
    axios.post(`${API_URL}/NonMemberTeeSlots`, values)
  )
  const {mutate: addCaddy} = useMutation((values: any) =>
    axios.post(`${API_URL}/CaddyTees`, values)
  )
  // fetching all gameschedule query
  const {data: allGameSchedule} = useQuery('allGameScheduleQuery', allGameScheduleApi)

  // fetcing all tees query
  const {data: allExistingTees} = useQuery('allExistingTees', () => getPlayers())

  const [form] = Form.useForm()
  const [nonMemberForm] = Form.useForm()
  const [caddForm] = Form.useForm()
  const queryClient = useQueryClient()
  const [chosenTime, setChosenTime] = useState('')
  const [chosenTimeNotLate, setChosenTimeNotLate] = useState('')
  const [cellSelectedDate, setcellSelectedDate] = useState('')
  const [slotData, setSlotData] = useState<any>([])
  const [allCaddyData, setallCaddyData] = useState<any>([])
  const [caddyPlayerId, setcaddyPlayerId] = useState<any>([])
  const [caddyFilteredData, setfilteredData] = useState<any>([])
  var counter = 6

  // const {data: playerMembers, isLoading} = useQuery(['membersQuery', chosenTimeNotLate], () =>
  //   getPlayerMembers(chosenTimeNotLate)
  // )

  // const {data: getCaddyPerTee, isLoading} = useQuery(
  //   ['getCaddyPerteeQuery', chosenTimeNotLate],
  //   () => getCaddyPerTeeApi(chosenTimeNotLate)
  // )
  const {data: getPlayersData} = useQuery('getPlayersQuery', () => getPlayers())
  //caddyArray.push(getCaddyPerTee?.data)
  const {data: getMembersData} = useQuery('getMembersData', () => getMembers())

  // const [formData, setFormData] = useState({
  //   memberId: '',
  //   playerType: 'Member',
  //   playerEmail: 'gio.aloyiogna@gmail.com',
  //   teeTime: '',
  //   playerName: 'Giovanni',
  //   availabilityStatus: 'yes',
  //   caddyId: 0,
  // })

  const [selectedDate, setSelectedDate] = useState<string>()
  const [modalContent, setModalContent] = useState({
    date: '',
    rowIndex: 1,
    columnIndex: 1,
  })
  const deletePlayer = (
    id: any,
    teeTime: string,
    memberId: any,
    playerType: any,
    playerEmail: any
  ) => {
    Modal.confirm({
      okText: 'Yes',
      okType: 'danger',
      title: 'Are you sure, you want to delete this player?',
      onOk: () => {
        if (playerType === 'Member') {
          const data = allExistingTees?.data.find((tee: any) => {
            return tee.teeTime == teeTime && tee.id == id
          })

          if (data) {
            deletePlayers(
              {id, teeTime},
              {
                onSuccess: () => {
                  // setIsEditing(false)
                  const slotdata = slotData.find((t: any) => {
                    return t.teeTime == teeTime && t.id == id
                  })
                  const newArr = slotData.filter((item: any) => {
                    return item.memberId != slotdata.memberId
                  })
                  setSlotData(newArr)
                  message.success('Member deleted successfully')
                  queryClient.invalidateQueries('membersQuery')
                  queryClient.invalidateQueries('tees')

                  form.resetFields()
                },
                onError: (error: any) => {
                  message.error('Failed to delete Member')
                  console.log(error.message)
                },
              }
            )
          } else {
            const newArr = slotData.filter((item: any) => {
              return item.memberId != memberId
            })
            setSlotData(newArr)
          }
        }

        if (playerType === 'Non-member') {
          const data = allExistingTees?.data.find((tee: any) => {
            return tee.teeTime == teeTime && tee.playerEmail == playerEmail
          })
          if (data) {
            deleteNonPlayers(
              {playerEmail, teeTime},
              {
                onSuccess: () => {
                  // setIsEditing(false)
                  const slotdata = slotData.find((t: any) => {
                    return t.teeTime == teeTime && t.playerEmail == playerEmail
                  })
                  const newArr = slotData.filter((item: any) => {
                    return item.playerEmail == playerEmail
                  })
                  setSlotData(newArr)
                  message.success('Member deleted successfully')
                  queryClient.invalidateQueries('membersQuery')
                  queryClient.invalidateQueries('tees')

                  form.resetFields()
                },
                onError: (error: any) => {
                  message.error('Failed to delete Member')
                  console.log(error.message)
                },
              }
            )
          } else {
            const newArr = slotData.filter((item: any) => {
              return item.playerEmail != playerEmail
            })
            setSlotData(newArr)
          }
        }
      },
    })
  }

  const getDatestring = () =>
    new Date(
      `${modalContent.date.split('T')[0]}${
        teeSlot[modalContent.rowIndex - 1][modalContent.columnIndex - 1]
      }`
    )
  // ${new Date(modalContent.date).toDateString()}

  const handleOk = (values: any) => {
    setConfirmLoading(true)
    form.submit()
  }

  const handleCancel = () => {
    form.resetFields()

    nonMemberForm.resetFields()
    caddForm.resetFields()
    setSlotData([])
    setallCaddyData([])
    setOpen(false)
  }
  const handleCancelCaddy = () => {
    setOpenCaddy(false)
  }
  const handleOnChange = (value: any) => {
    // form.setFieldsValue({
    //   selectDropDown: value
    // })
    var teeTime = `${modalContent.date.split('T')[0]}${' '}${getDatestring().toLocaleTimeString(
      'en-US',
      {hour12: false, hour: '2-digit', minute: '2-digit'}
    )}`

    const data = getMembersData?.data.find((item: any) => {
      return item.id == value
    })

    const newMemberObject = {
      memberId: value,
      playerType: 'Member',
      playerEmail: data.email,
      teeTime: teeTime,
      playerName: data.fname + data.lname,
      availabilityStatus: 'yes',
      caddyId: 0,
    }

    const isMemberExists = slotData.some((item: any) => item.memberId === newMemberObject.memberId)
    if (isMemberExists) {
      message.info('Member Already added!')
      return
    }
    if (slotData.length > 3) {
      message.info('Members cannot exceed 4!')
      return
    }

    setSlotData([...slotData, newMemberObject])
  }

  const handleOnChangeCaddy = (value: any) => {
    var teeTime = `${modalContent.date.split('T')[0]}${' '}${getDatestring().toLocaleTimeString(
      'en-US',
      {hour12: false, hour: '2-digit', minute: '2-digit'}
    )}`

    const data = allCaddyData?.find((item: any) => {
      return item.caddyId == value && item.teeTime == teeTime && item.memberId == caddyPlayerId
    })

    if (data) {
      message.info('Caddy already exists for this tee!')
      return
    }
    if (allCaddyData.length > 0) {
      message.info('More than 1 caddy cannot be assigned to one player!')
      return
    }
    const caddyDat = allCaddies?.data.filter((item: any) => {
      return item.id == value
    })

    const caddyObj = {
      playerId: caddyPlayerId?.toString(),
      caddyId: value,
      code: caddyDat[0].code ? caddyDat[0].code : 'C-001',
      teeTime: teeTime,
      caddyName: caddyDat[0].lname + '' + caddyDat[0].fname,
      caddyEmail: caddyDat[0].email,
      caddyPhone: caddyDat[0].phone,
      caddyGender: caddyDat[0].gender,
    }

    setallCaddyData([...allCaddyData, caddyObj])
  }

  const onFinish = (values: any) => {
    // var MemberFormData = new FormData()
    var teeTime = `${modalContent.date.split('T')[0]}${' '}${getDatestring().toLocaleTimeString(
      'en-US',
      {hour12: false, hour: '2-digit', minute: '2-digit'}
    )}`

    values.teeTime = teeTime
    values.playerType = 'Non-member'
    values.availabilityStatus = 'yes'
    values.caddyId = '0'

    const nonMemberExists = slotData.some((item: any) => item.playerEmail === values.playerEmail)
    if (nonMemberExists) {
      message.info('Non Member Already exists!')
      return
    }
    if (slotData.length > 3) {
      message.info('Members cannot exceed 4!')
      return
    }

    setSlotData([...slotData, values])

    nonMemberForm.resetFields()
  }
  const handleNonMemberSubmit = () => {
    slotData?.map((item: any) => {
      addNonMember(item, {
        onSuccess: () => {
          // setIsEditing(false)

          message.success('Member added successfully')
          queryClient.invalidateQueries('membersQuery')
          queryClient.invalidateQueries('getPlayersQuery')
          queryClient.invalidateQueries('allCaddiesQuery')
          queryClient.invalidateQueries('tees')
          //form.resetFields()
          //queryClient.invalidateQueries('membersQuery')
        },
        onError: (error: any) => {
          message.error('Failed to add Member')
          console.log(error.message)
        },
      })
      nonMemberForm.resetFields()
    })
  }
  const handleCaddyOnSubmit = () => {
    allCaddyData?.map((item: any) => {
      addCaddy(item, {
        onSuccess: () => {
          // setIsEditing(false)

          message.success('Caddy added successfully')
          queryClient.invalidateQueries('membersQuery')
          queryClient.invalidateQueries('getPlayersQuery')
          queryClient.invalidateQueries('allCaddiesQuery')
          queryClient.invalidateQueries('tees')
          setOpenCaddy(false)
          //form.resetFields()
          //queryClient.invalidateQueries('membersQuery')
        },
        onError: (error: any) => {
          message.error('Failed to add Member')
          console.log(error.message)
        },
      })
      caddForm.resetFields()
    })
  }

  const onFinishForMember = (values: any) => {
    Modal.confirm({
      okText: 'Yes',
      okType: 'danger',
      title: 'Are you sure, you want to add this member?',
      onOk: () => {
        slotData?.map(async (item: any) => {
          try {
            const data = allExistingTees?.data.find((tee: any) => {
              return tee.teeTime == item.teeTime && tee.memberId == item.memberId
            })
            if (!data) {
              const response = await axios.post(`${API_URL}/TeeSlots`, item)
            }
          } catch (error) {
            message.success('Adding member(s) failed!')
          } finally {
            form.resetFields()
            message.success('Member(s) added successfully!')
            queryClient.invalidateQueries('membersQuery')
            queryClient.invalidateQueries('getPlayersQuery')
            queryClient.invalidateQueries('allCaddiesQuery')
            queryClient.invalidateQueries('tees')
          }
        })
      },
    })
  }
  const [hostMembership, setHostMembership] = useState<string>()
  const [player2Membership, setplayer2Membership] = useState<string>()
  const [player3Membership, setplayer3Membership] = useState<string>()
  const [player4Membership, setplayer4Membership] = useState<string>()

  // const getMembers = async () => {
  //   const response = await axios.get(`${BASE_URL}/members`);
  //   return response.data;
  //   console.log('members', response.data);
  // }

  const memberships = [
    {label: 'Member', value: 'member'},
    {label: 'Non-Member', value: 'non-member'},
  ]

  const navigate = useNavigate()
  // get data from api
  // const getData = async () => {
  //   const response = await axios.get(`${BASE_URL}/teeSheetDate`)
  //   console.log(response)
  // }

  function clickCell(e: any, date: any) {
    if (e.target.tagName !== 'TD') return //ignore the click if it is not on a cell
    e.target.style.backgroundColor = 'red'
    setModalContent({
      date: date,
      rowIndex: e.target.parentNode.rowIndex,
      columnIndex: e.target.cellIndex,
    })
    setSlotData([])
    setallCaddyData([])
    caddForm.resetFields()
    form.resetFields()
    nonMemberForm.resetFields()
    setOpen(true)

    setChosenTime(
      `${modalContent.date.split('T')[0]}${' '}${getDatestring().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })}`
    )

    //  playersData
  }

  // picking the chosen date for fetching products

  // const updateDate=()=>{
  //   setChosenTime(`${modalContent.date.split('T')[0]}${' '}${getDatestring().toLocaleTimeString(
  //     'en-US',
  //     {hour12: false, hour: '2-digit', minute: '2-digit'}
  //   )}` )
  // }

  // cell per date
  function clickCell2(e: any, date: any) {
    // setModalContent({
    //   date: date,
    //   rowIndex: e.target.parentNode.rowIndex,
    //   columnIndex: e.target.cellIndex,
    // })
    setOpen(true)

    //get row that was click
    // console.log('row', e.target.parentNode.rowIndex)
    // //get column that was click
    // console.log('column', e.target.cellIndex)
    // setChosenTime(
    //   `${modalContent.date.split('T')[0]}${' '}${getDatestring().toLocaleTimeString('en-US', {
    //     hour12: false,
    //     hour: '2-digit',
    //     minute: '2-digit',
    //   })}`
    // )

    //  })
    //  console.log(getPlayers?.data);

    //  playersData
  }

  const getTeeByDate = allTees?.data.filter((item: any) => {
    return item.teeTime.includes(cellSelectedDate)
  })

  //tees per time
  let newDat: any = []
  getNextTwoWeeksDates()
    .slice(0, 14)
    .map((item, index) => {
      let teeByDateLength = allTees?.data
        .filter((el: any) => {
          return el.teeTime.includes(item.toLocaleDateString('en-CA'))
        })
        .filter((item: {teeTime: any}, index: number, arr: any[]) => {
          return !arr.some((obj, i) => {
            return obj.teeTime === item.teeTime && i < index
          })
        }).length
      newDat.push(teeByDateLength)
    })

  useEffect(() => {
    setSlotData([])
    setallCaddyData([])
    setChosenTimeNotLate(
      `${modalContent.date.split('T')[0]}${' '}${getDatestring().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })}`
    )
  }, [chosenTime])

  useEffect(() => {
    setSlotData([])
    setallCaddyData([])

    const data = getPlayersData?.data.filter((item: any) => {
      return item.teeTime == chosenTimeNotLate
    })
    setfilteredData(
      caddyTeesDataApi?.data.filter((item: any) => {
        return item.teeTime == chosenTimeNotLate
      })
    )

    data?.map((item: any) => {
      setSlotData((mem: any) => [...mem, item])
    })
  }, [chosenTimeNotLate])

  // adding caddies
  const addCaddyPerPlayer = (memberId: number) => {
    setcaddyPlayerId(memberId)

    const NewCaddyData = caddyFilteredData?.filter((item: any) => {
      return item.playerId == memberId
    })
    setallCaddyData([])

    NewCaddyData?.map((item: any) => {
      setallCaddyData((mem: any) => [...mem, item])
    })
    setOpenCaddy(true)
  }
  function getNextTwoWeeksDates() {
    //create an array to store next 7 days
    const today = new Date()
    let days = []
    days[0] = today

    for (let i = 1; i <= 13; i++) {
      days.push(
        add(new Date(), {
          days: i,
        })
      )
    }

    return days
  }
  function Range() {
    const params: any = useParams()
    const isoDateFromUrl = params.date
    const dateSelected = isoDateFromUrl ? new Date(isoDateFromUrl).toISOString() : undefined

    const minDate: Date = new Date()
    const maxDate: Date = getNextTwoWeeksDates()[13] //get the last date in the array
    const dateValue: Date | undefined = dateSelected ? new Date(dateSelected) : undefined
    return (
      <div className='control-pane'>
        <div className='control-section'>
          <div className='datepicker-control-section'>
            <DatePickerComponent
              id='calendar'
              min={minDate}
              max={maxDate}
              value={dateValue ? dateValue : undefined}
              onChange={(e: any) => handleCardClick(e.value)}
              placeholder={'Select Date to view tee sheet'}
            ></DatePickerComponent>
          </div>
        </div>
      </div>
    )
  }

  function ChosenDateTeesheet() {
    //get params from url
    const params: any = useParams()
    const isoDateFromUrl = params.date
    const dateSelected = new Date(isoDateFromUrl).toISOString()

    //  chosenTime= `${modalContent.date.split('T')[0]}${' '}${getDatestring().toLocaleTimeString(
    //   'en-US',
    //   {hour12: false, hour: '2-digit', minute: '2-digit'}
    // )}`
    // console.log('hello');
    // setFormData({...formData, teeTime:dateSelected})
    //2021-08-02T00:00:00.000Z
    setSelectedDate(dateSelected)
    // console.log(selectedDate);
    //form.resetFields()
    // queryClient.invalidateQueries('membersQuery')

    return (
      <>
        <KTCard className={styles.sheet}>
          <KTCardBody>
            <div className='table-responsive'>
              {/*title for the table*/}
              <div className='d-flex justify-content-center'>
                <h2>
                  <strong>{`${new Date(dateSelected).toDateString()}`}</strong>
                </h2>
              </div>
              <div className='d-flex justify-content-center mb-3'>
                {/*<span className="fst-itali fs-5 text-danger">*/}
                {/*  Please select tee time*/}
                {/*</span>*/}
              </div>
              {/*end title for the table*/}
              <table
                className='table table-rounded table-striped border gy-5 gs-5'
                id={'myTable'}
                onClick={(e) => {
                  clickCell(e, dateSelected)
                }}
              >
                <thead className='border'>
                  <tr className='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'>
                    <th className='min-w-50px'></th>
                    <th className='min-w-100px'>0</th>
                    <th className='min-w-100px'>10</th>
                    <th className='min-w-100px'>20</th>
                    <th className='min-w-100px'>30</th>
                    <th className='min-w-100px'>40</th>
                    <th className='min-w-100px'>50</th>
                  </tr>
                </thead>
                <tbody className='border'>
                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>6:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '06:00'
                        })
                        ?.map((tee: any) => (
                          <p
                            onClick={(e: any) => clickCell2(e, dateSelected)}
                            style={{cursor: 'pointer'}}
                            className='fs-9 mb-2 fw-light '
                          >
                            {tee.playerName}
                          </p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '06:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '06:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '06:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '06:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '06:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>7:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '07:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '07:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '07:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '07:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '07:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '07:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>

                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>8:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '08:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '08:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '08:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '08:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '08:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '08:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>

                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>9:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '09:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '09:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '09:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '09:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '09:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '09:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>

                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>10:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '10:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '10:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '10:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '10:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '10:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '10:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>11:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '11:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '11:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '11:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '11:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '11:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '11:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>12:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '12:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '12:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '12:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '12:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '12:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '12:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>13:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '13:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '13:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '13:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '13:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '13:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '13:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>14:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '14:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '14:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '14:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '14:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '14:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '14:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>15:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '15:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '15:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '15:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '15:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '15:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '15:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>
                  <tr>
                    <th className='fw-bold fs-6 text-gray-800'>16:00</th>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '16:00'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '16:10'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '16:20'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '16:30'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '16:40'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                    <td>
                      {getTeeByDate
                        ?.filter((item: any) => {
                          return item.teeTime.substr(11, 5) === '16:50'
                        })
                        ?.map((tee: any) => (
                          <p className='fs-9 mb-2 fw-light'>{tee.playerName}</p>
                        ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </KTCardBody>
        </KTCard>
      </>
    )
  }

  function handleCardClick(item: Date) {
    setcellSelectedDate(item.toLocaleDateString('en-CA'))
    navigate(`/tee-sheet/${item.toISOString().split('T')[0]}`)
    message.success('You have selected ' + item.toDateString()).then((r) => r)
  }

  const Option = Select.Option
  return (
    <Routes>
      <Route
        path='/'
        element={
          <>
            <Row>
              <Col span={24} lg={0}>
                <KTCard>
                  <KTCardBody>
                    <Range />
                  </KTCardBody>
                </KTCard>
              </Col>
            </Row>
            <Row gutter={16}>
              {/*//map through getNextTwoWeeksDates time*/}
              <Col span={0} lg={4}>
                <Row gutter={[8, 8]}>
                  {getNextTwoWeeksDates()
                    .slice(0, 7)
                    .map((item, index) => {
                      let eventArr: any = []
                      counter++
                      const data = allGameSchedule?.data.filter((filterData: any) => {
                        return (
                          filterData.startTime.split('T')[0] == item.toISOString().split('T')[0]
                        )
                      })

                      data?.forEach((element: any) => {
                        eventArr.push(element.description)
                      })

                      return (
                        <Col span={22}>
                          <Card
                            title={
                              <div>
                                {item.toDateString()}
                                {eventArr.map((event: any, index: any) => (
                                  <div key={index} className='fs-8 italic text-success p-1'>
                                    --{event}
                                  </div>
                                ))}
                              </div>
                            }
                            bordered={true}
                            onClick={() => {
                              handleCardClick(item)
                            }}
                            className={styles.card}
                          >
                            {/* <div className='d-flex justify-content-center mt-1'><CrownOutlined className='text-primary fs-6' /></div> */}
                            <div>Total Tees:{newDat[index]}</div>

                            {/* {eventArr.map((event: any, index: any) => (
                              <div key={index} className='fs-8 italic text-success p-1'>
                               --{event}
                              </div>
                            ))} */}
                          </Card>
                        </Col>
                      )
                    })}
                </Row>
              </Col>
              <Col span={0} lg={4}>
                <Row gutter={[8, 8]}>
                  {getNextTwoWeeksDates()
                    .slice(7, 14)
                    .map((item, index) => {
                      let eventArr: any = []
                      counter++
                      const data = allGameSchedule?.data.filter((filterData: any) => {
                        return (
                          filterData.startTime.split('T')[0] == item.toISOString().split('T')[0]
                        )
                      })

                      data?.forEach((element: any) => {
                        eventArr.push(element.description)
                      })

                      return (
                        <Col span={22}>
                          <Card
                            title={
                              <div>
                                {item.toDateString()}
                                {eventArr.map((event: any, index: any) => (
                                  <div key={index} className='fs-8 italic text-success p-1'>
                                    --{event}
                                  </div>
                                ))}
                              </div>
                            }
                            bordered={true}
                            onClick={() => {
                              handleCardClick(item)
                            }}
                            className={styles.card}
                          >
                            <div>Total Tees:{newDat[index]}</div>
                          </Card>
                        </Col>
                      )
                    })}
                </Row>
              </Col>
              <Outlet />
            </Row>
          </>
        }
      >
        <Route
          path=':date'
          element={
            <Col span={24} lg={16}>
              <ChosenDateTeesheet />
              <Modal
                // title={`Book for ${new Date(modalContent.date).toDateString()} at ${teeSlot[(modalContent.rowIndex)-1][(modalContent.columnIndex)-1]}`}
                title={`Book tee time for ${getDatestring().toDateString()} ${getDatestring().toLocaleTimeString()}`}
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
                width={isSmallScreen ? '90%' : 700}
              >
                <Tabs>
                  <Tabs.TabPane tab='Member' key='Member'>
                    <Form onFinish={onFinishForMember} form={form}>
                      <Space>
                        <Button
                          type='primary'
                          htmlType='submit'
                          className='menu-title btn-success mb-2'
                        >
                          Ok
                        </Button>

                        <Button className='btn btn-light-danger btn-sm mb-2' onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Space>
                      {/* <label htmlFor="member-select">Player: </label> */}
                      <Form.Item
                        name='selectDropDown'
                        rules={[{required: true, message: 'Please select member'}]}
                      >
                        <Select
                          placeholder='Select Member'
                          // onChange={(value) => memberOnChange(value)}
                          onChange={handleOnChange}
                          className='w-100 mb-2'
                        >
                          {/* <option value='' disabled>
                          Select Player
                        </option> */}
                          {members?.map((member: any) => (
                            <Option key={member.id} value={member.id}>
                              {member.fname}
                              {member.lname}-{member.membershipId}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Form>
                    <div
                      className='d-flex text-white p-1 justify-content-center'
                      style={{backgroundColor: '#47be7d'}}
                    >
                      {4 - slotData?.length === 0 ? (
                        <>
                          <p className='p-1 text-white h1 m-2'>List of players is full</p>
                        </>
                      ) : (
                        <>
                          <p className='p-1'>Players left: </p>
                          <span className='font-bold h2 text-white '>
                            <span
                              className='badge  p-3 font-bold fs-5 text-primary'
                              style={{backgroundColor: 'white'}}
                            >
                              {4 - slotData.length}
                            </span>
                          </span>
                        </>
                      )}
                    </div>
                    <Table columns={columns} dataSource={slotData} className='' />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab='Non-Member' key='NonMember'>
                    <Form onFinish={onFinish} form={nonMemberForm}>
                      <Space>
                        <Button
                          type='primary'
                          className='menu-title btn-success mb-2'
                          onClick={handleNonMemberSubmit}
                        >
                          Ok
                        </Button>

                        <Button className='btn btn-light-danger btn-sm mb-2' onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Space>
                      <Form.Item
                        name='playerName'
                        label='Name'
                        rules={[{required: true, message: 'Please input your name!'}]}
                      >
                        <Input
                          placeholder='Name'
                          prefix={<UserOutlined className='site-form-item-icon' />}
                        />
                      </Form.Item>
                      <Form.Item
                        name='playerEmail'
                        label='Email'
                        rules={[{required: true, message: 'Please input your email!'}]}
                      >
                        <Input
                          type='email'
                          placeholder='Email'
                          prefix={<MailOutlined className='site-form-item-icon' />}
                        />
                      </Form.Item>
                      <Space size='middle'>
                        <Button
                          type='primary'
                          htmlType='submit'
                          className='menu-title btn-success mb-2'
                        >
                          Submit
                        </Button>
                      </Space>
                    </Form>

                    <div
                      className='bg-success d-flex text-white p-1 justify-content-center'
                      style={{backgroundColor: '#47be7d'}}
                    >
                      {4 - slotData.length === 0 ? (
                        <>
                          <p className='p-1 text-white h1'>List of players is full</p>
                        </>
                      ) : (
                        <>
                          <p className='p-1'>Players left: </p>
                          <span className='font-bold p-1 h2 text-white '>
                            <span
                              className='badge  p-3 font-bold fs-5 text-primary'
                              style={{backgroundColor: 'white'}}
                            >
                              {4 - slotData.length}
                            </span>
                          </span>
                        </>
                      )}
                    </div>
                    <Table columns={columns} className='' dataSource={slotData} />
                  </Tabs.TabPane>
                  {/* <Tabs.TabPane tab='Caddy' key='Caddy'>
                    <Form form={caddForm}>
                      <Space>
                        <Button
                          type='primary'
                          htmlType='submit'
                          className='menu-title btn-success mb-2'
                          onClick={handleCaddyOnSubmit}
                        >
                          Ok
                        </Button>
                        <Button className='btn btn-light-danger btn-sm mb-2' onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Space>
                      <Form.Item
                        name='caddselectdropdown'
                        rules={[{required: true, message: 'Please select caddy!'}]}
                      >
                        <Select
                          placeholder='Select Caddy'
                          // onChange={(value) => memberOnChange(value)}
                          onChange={handleOnChangeCaddy}
                          className='w-100 m-1'
                        >
                          {allCaddies?.data.map((caddy: any) => (
                            <Option key={caddy.id} value={caddy.id}>
                              {caddy.fname}
                              {caddy.lname}-{caddy.code}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Form>

                    <Table columns={caddyColumns} dataSource={allCaddyData} className='' />
                  </Tabs.TabPane> */}
                </Tabs>
              </Modal>
              <Modal
                // title={`Book for ${new Date(modalContent.date).toDateString()} at ${teeSlot[(modalContent.rowIndex)-1][(modalContent.columnIndex)-1]}`}
                title={`Add caddy`}
                open={openCaddy}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancelCaddy}
                footer={null}
                width={isSmallScreen ? '90%' : 700}
              >
                <Form onFinish={handleCaddyOnSubmit} form={caddForm}>
                  <Space>
                    <Button
                      type='primary'
                      htmlType='submit'
                      className='menu-title btn-success mb-2'
                      onClick={handleCaddyOnSubmit}
                    >
                      Ok
                    </Button>
                    <Button
                      className='btn btn-light-danger btn-sm mb-2'
                      onClick={handleCancelCaddy}
                    >
                      Cancel
                    </Button>
                  </Space>
                  {/* <label htmlFor="member-select">Player: </label> */}
                  <Form.Item
                    name='selectDropDown'
                    rules={[{required: true, message: 'Please select caddy'}]}
                  >
                    <Select
                      placeholder='Select caddy'
                      // onChange={(value) => memberOnChange(value)}
                      onChange={handleOnChangeCaddy}
                      className='w-100 mb-2'
                    >
                      {/* <option value='' disabled>
                          Select Player
                        </option> */}
                      {allCaddies?.data.map((caddy: any) => (
                        <Option key={caddy.id} value={caddy.id}>
                          {caddy.fname}
                          {caddy.lname}-{caddy.code}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>

                <Table columns={caddyColumns} dataSource={allCaddyData} />
              </Modal>
            </Col>
          }
        />
      </Route>
    </Routes>
  )
}

export {TeeSheet}
