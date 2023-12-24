import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Table, Input } from 'antd'

import { ProductsTable } from './ProductsTable'
import { FETCH_PRODUCTS } from 'redux/constants/App'
import { Loading } from 'components/shared-components/Loading'

const Products = () => {
  const dispatch = useDispatch()
  const { loading, products } = useSelector((store) => store.app)
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    !products.length && dispatch({ type: FETCH_PRODUCTS })
  }, [products, dispatch])

  const handleSearchChange = (e) => setNameFilter(e.target.value)

  const tableColumns = ProductsTable()

  const filteredProducts = products.filter((product) => product.title.includes(nameFilter))

  if (loading) return <Loading />

  return (
    <>
      <div className="d-flex-row">
        <Input placeholder="Search" style={{ width: 250 }} onChange={handleSearchChange} />
      </div>
      <Card bodyStyle={{ padding: '0px' }}>
        <Table columns={tableColumns} dataSource={filteredProducts} rowKey="id" />
      </Card>
    </>
  )
}

export default Products
