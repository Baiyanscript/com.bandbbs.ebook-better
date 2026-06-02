import file from '@system.file'
import storage from './storage.js'
import bookStorage from './bookStorage.js'

const BASE_URI = 'internal://files/books/'

function generateHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

const CHAPTER_CONTENTS = [
  '清晨的阳光透过窗帘洒进房间，唤醒了沉睡中的城市。街上的行人渐渐多了起来，各自奔赴忙碌的一天。在这个信息爆炸的时代，能够静下心来阅读一本好书，是一件多么幸福的事情。\n\n电子书的出现让阅读变得更加便捷。无论身处何地，只需轻轻一点，便能进入书中的世界。从经典文学到现代小说，从科学技术到人文哲学，海量的书籍触手可及。\n\n阅读不仅是获取知识的途径，更是一种生活方式。当我们沉浸在文字的海洋中时，心灵得到了前所未有的宁静。每一个故事都是一段旅程，每一篇文章都是一次心灵的对话。\n\n好的阅读体验需要好的工具支撑。一个舒适的阅读界面，合理的字体大小，恰当的行间距，这些细节都会影响阅读的感受。我们致力于为用户提供最佳的阅读体验。\n\n愿每一位读者都能在书中找到属于自己的那份感动，让阅读成为生活中不可或缺的一部分。无论是通勤路上还是睡前时光，都能享受阅读带来的快乐。',

  '技术的发展日新月异，人工智能正在改变着我们的生活。从语音助手到自动驾驶，从医疗诊断到教育创新，人工智能的应用场景越来越广泛。\n\n在穿戴设备领域，人工智能同样发挥着重要作用。智能手表和手环不仅能够监测健康数据，还能提供个性化的服务建议。通过机器学习算法，设备能够更好地理解用户的需求和习惯。\n\n然而，技术的发展也带来了一些挑战。数据隐私、算法偏见、就业影响等问题需要我们认真思考和应对。只有在技术发展与伦理规范之间找到平衡，才能让科技真正造福人类。\n\n作为开发者，我们有责任确保技术的安全性和可靠性。每一行代码都可能影响到用户的体验和安全，因此我们需要保持敬畏之心，严谨对待每一个细节。\n\n未来已来，让我们共同拥抱技术带来的变革，同时保持理性和审慎的态度。',

  '生活就像一本书，每一页都记录着不同的故事。有时候平淡如水，有时候波澜壮阔。重要的不是故事本身，而是我们如何去阅读和理解它。\n\n在这个快节奏的社会中，我们常常忽略了身边的美好。一顿简单的晚餐，一次随意的散步，一个温暖的微笑，这些看似平凡的瞬间，其实都是生活中最珍贵的礼物。\n\n学会放慢脚步，用心去感受生活的每一个细节。当我们在忙碌中停下来，才发现原来世界如此美好。阳光依然温暖，微风依然轻柔，花儿依然绽放。\n\n阅读也是一种慢生活的方式。当我们翻开一本书，时间仿佛静止了。我们可以跟随作者的笔触，去体验不同的人生，去感受不同的世界。这种体验是独一无二的。\n\n珍惜当下，感恩生活。让每一天都充满意义，让每一刻都值得回忆。这就是生活的真谛，也是阅读带给我们的启示。'
]

function generateBookName() {
  return new Promise(function(resolve) {
    bookStorage.getBooks().then(function(books) {
      var maxNum = 0
      books.forEach(function(book) {
        var match = book.name.match(/^测试书籍(\d+)$/)
        if (match) {
          var num = parseInt(match[1])
          if (num > maxNum) maxNum = num
        }
      })
      resolve('测试书籍' + (maxNum + 1))
    }).catch(function() {
      resolve('测试书籍1')
    })
  })
}

function getPredefinedColor(index) {
  var colors = [
    'rgba(120, 80, 60, 0.35)', 'rgba(60, 90, 120, 0.35)', 'rgba(80, 110, 70, 0.35)',
    'rgba(100, 70, 100, 0.35)', 'rgba(70, 85, 100, 0.35)', 'rgba(90, 75, 65, 0.35)',
    'rgba(65, 95, 85, 0.35)', 'rgba(85, 70, 90, 0.35)', 'rgba(75, 90, 75, 0.35)',
    'rgba(95, 80, 70, 0.35)', 'rgba(70, 80, 95, 0.35)', 'rgba(80, 75, 85, 0.35)'
  ]
  return colors[index % colors.length]
}

function ensureDir(uri) {
  return new Promise(function(resolve) {
    file.access({
      uri: uri,
      success: function() { resolve() },
      fail: function() {
        file.mkdir({ uri: uri, recursive: true, success: function() { resolve() }, fail: function() { resolve() } })
      }
    })
  })
}

export function generateTestBook() {
  return new Promise(function(resolve, reject) {
    generateBookName().then(function(bookName) {
      var dirName = generateHash(bookName)
      var bookDir = BASE_URI + dirName + '/'
      var contentDir = bookDir + 'content/'
      var indexesDir = bookDir + 'indexes/'

      ensureDir(bookDir).then(function() {
        return ensureDir(contentDir)
      }).then(function() {
        return ensureDir(indexesDir)
      }).then(function() {
        var chapters = [
          { index: 0, name: '第一章 清晨的阳光', content: CHAPTER_CONTENTS[0], wordCount: CHAPTER_CONTENTS[0].length },
          { index: 1, name: '第二章 技术的力量', content: CHAPTER_CONTENTS[1], wordCount: CHAPTER_CONTENTS[1].length },
          { index: 2, name: '第三章 生活的真谛', content: CHAPTER_CONTENTS[2], wordCount: CHAPTER_CONTENTS[2].length }
        ]

        var totalWordCount = 0
        chapters.forEach(function(ch) { totalWordCount += ch.wordCount })

        var writeChain = Promise.resolve()
        chapters.forEach(function(ch) {
          writeChain = writeChain.then(function() {
            return new Promise(function(res) {
              file.writeText({
                uri: contentDir + ch.index + '.txt',
                text: ch.content,
                success: function() { res() },
                fail: function() { res() }
              })
            })
          })
        })

        writeChain.then(function() {
          var lindexContent = chapters.length + '\n' + chapters.length + '\n0,' + (chapters.length - 1) + '\n'
          return new Promise(function(res) {
            file.writeText({ uri: bookDir + 'lindex.txt', text: lindexContent, success: function() { res() }, fail: function() { res() } })
          })
        }).then(function() {
          var indexContent = ''
          chapters.forEach(function(ch) {
            indexContent += ch.index + '\t' + ch.name + '\t' + ch.wordCount + '\n'
          })
          return new Promise(function(res) {
            file.writeText({ uri: indexesDir + '1.txt', text: indexContent, success: function() { res() }, fail: function() { res() } })
          })
        }).then(function() {
          var bookInfo = {
            name: bookName,
            chapterCount: chapters.length,
            wordCount: totalWordCount,
            hasCover: false,
            coverFileName: null,
            author: '测试作者',
            summary: '这是一本用于功能测试的电子书，包含三个章节的中文内容。',
            bookStatus: '已完成',
            category: '测试',
            localCategory: '测试'
          }
          return new Promise(function(res) {
            file.writeText({ uri: bookDir + 'book_info.json', text: JSON.stringify(bookInfo), success: function() { res() }, fail: function() { res() } })
          })
        }).then(function() {
          return bookStorage.getBooks()
        }).then(function(books) {
          var newBook = {
            name: bookName,
            dirName: dirName,
            chapterCount: chapters.length,
            wordCount: totalWordCount,
            hasCover: false,
            coverFileName: null,
            progress: {},
            localCategory: '测试'
          }
          books.push(newBook)
          return bookStorage.updateBooks(books)
        }).then(function() {
          globalThis.shouldRefreshShelf = true
          resolve(bookName)
        })
      }).catch(function(e) { reject(e) })
    })
  })
}
