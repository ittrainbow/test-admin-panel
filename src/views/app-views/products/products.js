import React, { useState, useEffect } from 'react'
import { Card, Table, Input, Select } from 'antd'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { productsTable } from './productsTable'

const Products = () => {
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [select, setSelect] = useState([{ value: 'all', label: 'All' }])
  const [products, setProducts] = useState([])
  const [nameFilter, setNameFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

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

  useEffect(() => {
    console.log(200, open)
  }, [open])

  const toUpperCase = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  const handleSearchChange = (e) => {
    const { value } = e.target
    setNameFilter(value)
  }

  const handleSelectChange = (e) => {
    setOpen(false)
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
        <Select
          defaultValue={select[0].label}
          style={{ width: 250, zIndex: 1001 }}
          onChange={handleSelectChange}
          options={select}
        />
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
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
