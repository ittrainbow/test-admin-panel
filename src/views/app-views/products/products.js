import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Select } from 'antd'
import { productsTable } from './productsTable'

const Products = () => {
  const [loading, setLoading] = useState(true)
  const [select, setSelect] = useState([{ value: 'all', label: 'All' }])
  const [products, setProducts] = useState([])
  const [nameFilter, setNameFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  console.log(1000, 'products render')

  useEffect(() => {
    const fetchProducts = async () =>
      await fetch('https://fakestoreapi.com/products/')
        .then((resp) => resp.json())
        .then((data) => {
          const composeSelect = [...new Set(data.map((el) => el.category))].map((el) => {
            return { value: el, label: toUpperCase(el) }
          })

          setProducts(data)
          setSelect((select) => select.concat(composeSelect))
        })
        .finally(setLoading(false))

    fetchProducts()
  }, [])

  const toUpperCase = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  const handleSearchChange = (e) => {
    const { value } = e.target
    setNameFilter(value)
  }

  const handleSelectChange = (e) => {
    const value = e === 'all' ? '' : e
    setCategoryFilter(value)
  }

  const tableColumns = productsTable()

  const filteredProducts = products
    .filter((product) => product.title.includes(nameFilter))
    .filter((product) => product.category.includes(categoryFilter))

  return (
    <>
      <div className="d-flex-row">
        <Input placeholder="Search" style={{ width: 250 }} onChange={handleSearchChange} />
        <Select defaultValue={select[0].label} style={{ width: 250 }} onChange={handleSelectChange} options={select} />
      </div>
      {!loading && (
        <Card bodyStyle={{ padding: '0px' }}>
          <Table columns={tableColumns} dataSource={filteredProducts} rowKey="id" />
        </Card>
      )}
    </>
  )
}

export default Products
