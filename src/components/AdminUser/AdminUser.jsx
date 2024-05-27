import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Input, Modal, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import { getBase64 } from '../../utils'
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/useMutationHook'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import * as UserService from '../../services/UserServices'

const AdminUser = () => {
      const [open, setOpen] = useState(false);
      const [rowSelected, setRowSelected] = useState('');
      const [isLoadingUpdate, setIsLoadingUpdtae] = useState(false)
      const [isOpenDrawer, setIsOpenDrawer] = useState(false);
      const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
      const user = useSelector((state) => state?.user)
      const searchInput = useRef(null);

      const [form] = Form.useForm();
      const [stateUser, setStateUser] = useState({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
            avatar: '',
            address: ''
      });

      const [stateUserDetails, setStateUserDetails] = useState({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
            avatar: '',
            address: ''
      });

      const mutationUpdate = useMutationHooks(
            (data) => {
                  console.log('data', data)
                  const { id,
                        token,
                        ...rests } = data
                  const res = UserService.updateUser(
                        id,

                        { ...rests }, token)
                  return res
            },
      )

      const mutationDeleted = useMutationHooks(
            (data) => {
                  const { id,
                        token,
                  } = data
                  const res = UserService.deleteUser(
                        id,
                        token)
                  return res
            },
      )

      const fetchGetDetailsUser = async (rowSelected) => {
            const res = await UserService.getDetailsUser(rowSelected)
            if (res?.data) {
                  setStateUserDetails({
                        name: res?.data?.name,
                        email: res?.data?.email,
                        phone: res?.data?.phone,
                        isAdmin: res?.data?.isAdmin,
                        address: res?.data?.address,
                        avatar: res.data?.avatar
                  })
            }
            setIsLoadingUpdtae(false)
      }

      useEffect(() => {
            form.setFieldsValue(stateUserDetails)
      }, [form, stateUserDetails])

      useEffect(() => {
            if (rowSelected) {
                  setIsLoadingUpdtae(true)
                  fetchGetDetailsUser(rowSelected)
            }
      }, [rowSelected])


      const handleDetailProduct = () => {
            setIsOpenDrawer(true)
      }

      const getAllUsers = async () => {
            const res = await UserService.getAllUser()
            console.log('res', res)
            return res
      }

      const renderAction = () => {
            return (
                  <div>
                        <DeleteOutlined style={{ fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                        <EditOutlined style={{ fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailProduct} />
                  </div>
            )
      }

      const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
      const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted

      const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
      const { isLoading: isLoadingUsers, data: users } = queryUser


      const handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();

      };
      const handleReset = (clearFilters) => {
            clearFilters();

      };

      const getColumnSearchProps = (dataIndex) => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                  <div
                        style={{
                              padding: 8,
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                  >
                        <Input
                              ref={searchInput}
                              placeholder={`Search ${dataIndex}`}
                              value={selectedKeys[0]}
                              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                              style={{
                                    marginBottom: 8,
                                    display: 'block',
                              }}
                        />
                        <Space>
                              <Button
                                    type="primary"
                                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                                    icon={<SearchOutlined />}
                                    size="small"
                                    style={{
                                          width: 90,
                                    }}
                              >
                                    Search
                              </Button>
                              <Button
                                    onClick={() => clearFilters && handleReset(clearFilters)}
                                    size="small"
                                    style={{
                                          width: 90,
                                    }}
                              >
                                    Reset
                              </Button>
                        </Space>
                  </div>
            ),
            filterIcon: (filtered) => (
                  <SearchOutlined
                        style={{
                              color: filtered ? '#1890ff' : undefined,
                        }}
                  />
            ),
            onFilter: (value, record) =>
                  record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownOpenChange: (visible) => {
                  if (visible) {
                        setTimeout(() => searchInput.current?.select(), 100);
                  }
            },
      });


      const columns = [
            {
                  title: 'Name',
                  dataIndex: 'name',
                  render: (text) => <a>{text}</a>,
                  sorter: (a, b) => a.name.length - b.name.length,
                  ...getColumnSearchProps('name')
            },
            {
                  title: 'Email',
                  dataIndex: 'email',
                  sorter: (a, b) => a.email.length - b.email.length,
                  ...getColumnSearchProps('email')
            },
            {
                  title: 'Address',
                  dataIndex: 'address',
                  sorter: (a, b) => a.address.length - b.address.length,
                  ...getColumnSearchProps('address')
            },
            {
                  title: 'Admin',
                  dataIndex: 'isAdmin',
                  filters: [
                        {
                              text: 'TRUE',
                              value: true,
                        },
                        {
                              text: 'FALSE',
                              value: false,
                        }
                  ],
            },
            {
                  title: 'Phone',
                  dataIndex: 'phone',
                  sorter: (a, b) => a.phone - b.phone,
                  ...getColumnSearchProps('phone')
            },
            {
                  title: 'Action',
                  dataIndex: 'action',
                  render: renderAction
            },
      ];

      const dataTable = users?.data?.length && users?.data?.map((user) => {
            return { ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' }
      })




      const handleOnchangeDetails = (e) => {
            setStateUserDetails({
                  ...stateUserDetails,
                  [e.target.name]: e.target.value
            })
      }


      const handleCloseDrawer = () => {
            setIsOpenDrawer(false);
            setStateUserDetails({
                  name: '',
                  email: '',
                  phone: '',
                  isAdmin: false,

            })
            form.resetFields()
      };

      useEffect(() => {
            if (isSuccessUpdated && dataUpdated?.status === 'OK') {
                  message.success()
                  handleCloseDrawer()
            } else if (isErrorUpdated) {
                  message.error()
            }
      }, [isSuccessUpdated])

      useEffect(() => {
            if (isSuccessDelected && dataDeleted?.status === 'OK') {
                  message.success()
                  handleCancelDelete()
            } else if (isErrorDeleted) {
                  message.error()
            }
      }, [isSuccessDelected])

      const handleCancelDelete = () => {
            setIsModalOpenDelete(false)
      }

      const handleDeleteUser = () => {
            mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
                  onSettled: () => {
                        queryUser.refetch()
                  }
            })
      }

      const handleOnchangeAvatar = async ({ fileList }) => {
            const file = fileList[0]
            if (!file.url && !file.preview) {
                  file.preview = await getBase64(file.originFileObj);
            }
            setStateUser({
                  ...stateUser,
                  image: file.preview
            })
      }

      const handleOnchangeAvatarDetails = async ({ fileList }) => {
            const file = fileList[0]
            if (!file.url && !file.preview) {
                  file.preview = await getBase64(file.originFileObj);
            }
            setStateUserDetails({
                  ...stateUserDetails,
                  avatar: file.preview
            })
      }

      const onUpdateUser = () => {
            mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
                  onSettled: () => {
                        queryUser.refetch()
                  }
            })
      }
      return (
            <div>
                  <WrapperHeader>Quản lý người dùng</WrapperHeader>

                  <div>
                        <TableComponent columns={columns} isLoadingProducts={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
                              return {
                                    onClick: event => {
                                          setRowSelected(record._id)
                                    }
                              }
                        }
                        } />
                  </div>

                  <DrawerComponent forceRender title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                              <Form
                                    name="basic" labelCol={{ span: 6, }}
                                    wrapperCol={{ span: 18, }}
                                    style={{ maxWidth: 600, }}
                                    onFinish={onUpdateUser}
                                    autoComplete="off"
                                    form={form}
                              >
                                    <Form.Item
                                          label="Name"
                                          name="name"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: 'Please input your name!',
                                                },
                                          ]}
                                    >
                                          <Input value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
                                    </Form.Item>

                                    <Form.Item
                                          label="Email"
                                          name="email"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: 'Please input your email!',
                                                },
                                          ]}
                                    >
                                          <Input value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" />
                                    </Form.Item>

                                    <Form.Item
                                          label="Phone"
                                          name="phone"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: 'Please input your phone!',
                                                },
                                          ]}
                                    >
                                          <Input value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                                    </Form.Item>

                                    <Form.Item
                                          label="Address"
                                          name="address"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: 'Please input your address!',
                                                },
                                          ]}
                                    >
                                          <Input value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                                    </Form.Item>

                                    <Form.Item
                                          label="Avatar"
                                          name="avatar"
                                          rules={[
                                                {
                                                      required: true,
                                                      message: 'Please input your avatar!',
                                                },
                                          ]}
                                    >
                                          <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                                <Button >Select File</Button>
                                                {stateUserDetails?.avatar && (
                                                      <img src={stateUserDetails?.avatar} style={{
                                                            height: '60px',
                                                            width: '60px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            marginLeft: '10px'
                                                      }} alt="avatar" />
                                                )}
                                          </WrapperUploadFile >
                                    </Form.Item>

                                    <Form.Item
                                          wrapperCol={{
                                                offset: 20,
                                                span: 16,
                                          }}
                                    >
                                          <Button type="primary" htmlType="submit">
                                                Apply
                                          </Button>
                                    </Form.Item>
                              </Form>
                        </Loading>
                  </DrawerComponent>
                  <ModalComponent forceRender open={isModalOpenDelete} title="Xóa người dùng" onCancel={handleCancelDelete} onOk={handleDeleteUser} >
                        <Loading isLoading={isLoadingDeleted}>
                              <div>Bạn có chắc xóa tài khoản này không?</div>
                        </Loading>
                  </ModalComponent>
            </div>
      )
}

export default AdminUser