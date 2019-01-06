const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = (date, format) => {
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  const hh = date.getHours()
  const min = date.getMinutes()
  const ss = date.getSeconds()

  console.log(format)
  console.log(format.replace('yyyy', yyyy))

  if (format == "无") {
    return ""
  }

  return format.replace('yyyy', yyyy).replace('mm', mm).replace('dd', dd).replace('hh', hh).replace('mm', min).replace('ss', ss)
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

let token = ""
const getToken = n => {
  wx.getStorage({
    key: 'token',
    success(res){
      console.log(res)
      token = res.data
    }
  })
}

const request = (url, option) => {
  token = token || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJ1c2VybmFtZSI6IjE4MzE5MDA1NjMzIiwiZXhwIjoxNTQ2MDcyNzkyLCJlbWFpbCI6IiJ9.w1fCHsRzaXcqwzyo2uHTO0-ektIVk7peQSf52UFk0pY"
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: option.data || [],
      header: {
        "Content-Type": "application/json",
        "Authorization": "JWT " + token
      },
      method: option.method || 'GET',
      dataType: option.dataType || 'json',
      responseType: option.responseType || 'text',
      success: function (res) {
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) {
        return res
      },
    })
  })
}

module.exports = {
  formatTime: formatTime,
  request,
  getToken,
  formatDate
}
