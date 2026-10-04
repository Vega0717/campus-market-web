<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getItems, createItem, markSold, deleteItem } from '../api/item.js'

const list = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
const loading = ref(false)
const errorMsg = ref('')
const showForm = ref(false)

const query = reactive({
  keyword: '',
  status: ''
})

const form = reactive({
  title: '',
  description: '',
  price: null,
  category: 'book',
  seller: '',
  contact: ''
})

const STATUS_TEXT = { 0: '在售', 1: '已售出', 2: '已下架' }
const CATEGORY_TEXT = {
  book: '教材书籍',
  digital: '数码电子',
  daily: '生活用品',
  other: '其他'
}

const statusText = (s) => STATUS_TEXT[s] || '未知'
const categoryText = (c) => CATEGORY_TEXT[c] || c

async function load() {
  loading.value = true
  errorMsg.value = ''
  try {
    const params = { page: page.value, size: size.value }
    if (query.keyword) params.keyword = query.keyword
    if (query.status !== '') params.status = query.status
    const data = await getItems(params)
    list.value = data.records
    total.value = data.total
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

async function publish() {
  errorMsg.value = ''
  try {
    await createItem({ ...form })
    Object.assign(form, {
      title: '',
      description: '',
      price: null,
      category: 'book',
      seller: '',
      contact: ''
    })
    showForm.value = false
    await load()
  } catch (e) {
    errorMsg.value = e.message
  }
}

async function sold(id) {
  try {
    await markSold(id)
    await load()
  } catch (e) {
    errorMsg.value = e.message
  }
}

async function remove(id) {
  if (!window.confirm('确定删除这件商品？')) return
  try {
    await deleteItem(id)
    await load()
  } catch (e) {
    errorMsg.value = e.message
  }
}

function search() {
  page.value = 1
  load()
}

onMounted(load)
</script>

<template>
  <div class="card">
    <div class="bar">
      <input v-model="query.keyword" placeholder="搜索标题或描述" @keyup.enter="search" />
      <select v-model="query.status">
        <option value="">全部状态</option>
        <option value="0">在售</option>
        <option value="1">已售出</option>
        <option value="2">已下架</option>
      </select>
      <button @click="search">搜索</button>
      <button class="ghost" @click="showForm = !showForm">
        {{ showForm ? '收起' : '发布闲置' }}
      </button>
    </div>

    <div v-if="showForm" class="form">
      <input v-model="form.title" placeholder="标题" />
      <input v-model.number="form.price" type="number" step="0.01" placeholder="价格" />
      <input v-model="form.seller" placeholder="卖家" />
      <select v-model="form.category">
        <option value="book">教材书籍</option>
        <option value="digital">数码电子</option>
        <option value="daily">生活用品</option>
        <option value="other">其他</option>
      </select>
      <input v-model="form.description" placeholder="描述（选填）" />
      <input v-model="form.contact" placeholder="联系方式（选填）" />
      <button @click="publish">提交</button>
    </div>
  </div>

  <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
  <p v-if="loading" class="tip">加载中...</p>

  <div class="card">
    <table v-if="list.length">
      <thead>
        <tr>
          <th>标题</th>
          <th>价格</th>
          <th>分类</th>
          <th>卖家</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>
            <div>{{ item.title }}</div>
            <small class="desc">{{ item.description }}</small>
          </td>
          <td>￥{{ item.price }}</td>
          <td>{{ categoryText(item.category) }}</td>
          <td>{{ item.seller }}</td>
          <td>
            <span class="tag" :class="'s' + item.status">{{ statusText(item.status) }}</span>
          </td>
          <td>
            <button v-if="item.status === 0" class="link" @click="sold(item.id)">标记售出</button>
            <button class="link danger" @click="remove(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="tip">暂无数据</p>
    <p class="tip">共 {{ total }} 条</p>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

th {
  background: #fafbfc;
}

.desc {
  color: #999;
}

.tag {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.s0 {
  background: #e6f7e9;
  color: #2e7d32;
}

.s1 {
  background: #f1f1f1;
  color: #777;
}

.s2 {
  background: #fdeaea;
  color: #c62828;
}

.link {
  background: none;
  color: #2f6fed;
  border: none;
  padding: 0 8px 0 0;
  cursor: pointer;
}

.danger {
  color: #c62828;
}

.error {
  color: #c62828;
  font-size: 14px;
}

.tip {
  color: #888;
  font-size: 13px;
}
</style>
