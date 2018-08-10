export default {
  props: {
    coursetable: {
      type: Object,
      default () {
        return {}
      }
    },
    currenttable: {
      type: Array,
      default () {
        return []
      }
    },
    classtable: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {
      //drag状态
      ondrag: false,
      //单元格模板样式
      adjustcourseborderstyle: {},
      //单元格数据
      emptytable: [],



      //每天有几节课
      dailylesson: 0,
      //每周哪些天上课
      weeklydays: [],

      //鼠标事件数据
      mouseX: 0,
      mouseY: 0,

      //选中的教师课程
      dragedlesson: null,

      //渲染一个假的教师课程
      fakelesson: null,

      //refresh
      refreshit: 1,
    }
  },
  mounted() {


    //解析课表模板
    this.dailylesson = this.coursetable.morningLesson + this.coursetable.forenoonLesson + this.coursetable.afternoonLesson + this.coursetable.eveningLesson
    this.weeklydays = this.coursetable.days.split(',')
    this.adjustcourseborderstyle = {
      height: this.dailylesson * 70 + 40 + "px"
    }

    //初始化空课程表
    Array.from(Array(this.weeklydays.length + 1)).map((week, weekindex) => {
      Array.from(Array(this.dailylesson + 1)).map((lesson, lessonindex) => {

        /**
         * 构建空课程表
         * 周0和早中休息样式不同一般课程
         */


        if (lessonindex == 0) {
          //渲染表格头部
          if (weekindex == 0) {
            this.emptytable.push({
              html: `<image style='opacity:.4;position:absolute;height:100%;width:100%;left:0;top:0;' src='${require("./line.png")}'></image><div style='position:absolute;left:5px;bottom:2px;'>节次</div><div style='position:absolute;right:5px;top:2px;'>星期</div>`,
              style: {
                position: "absolute",
                height: "40px",
                left: "0px",
                top: "0px",
                width: '10%',
                borderRight: '1px solid rgb(224, 231, 236)',
                borderBottom: '1px solid rgb(224, 231, 236)',
                backgroundColor: 'rgb(238,241,246)'
              }
            })
          } else {
            this.emptytable.push({
              html: `<div>星期${Number(this.weeklydays[weekindex-1])+1<6?Number(this.weeklydays[weekindex-1])+1:(Number(this.weeklydays[weekindex-1])+1==6?'六':'日')}</div>`,
              style: {
                position: "absolute",
                height: "40px",
                left: 10 + (weekindex - 1) * (1 / this.weeklydays.length * 90) + "%",
                width: 1 / this.weeklydays.length * 90 + '%',
                borderRight: '1px solid rgb(224, 231, 236)',
                borderBottom: '1px solid rgb(224, 231, 236)',
                backgroundColor: 'rgb(238,241,246)'
              }
            })
          }
        } else {

          if (weekindex == 0) {
            //渲染表格纵坐标
            this.emptytable.push({
              html: this.conversionLessonindex(lessonindex - 1, weekindex),
              style: {
                position: "absolute",
                left: "0px",
                top: (lessonindex - 1) * 70 + 40 + "px",
                height: "70px",
                width: '10%',
                borderRight: '1px solid rgb(224, 231, 236)',
                borderBottom: '1px solid rgb(224, 231, 236)',
                backgroundColor: 'rgb(238,241,246)'
              }
            })

          } else {
            //渲染空表格
            this.emptytable.push({
              html: "",
              weekindex,
              lessonindex,
              style: {
                position: "absolute",
                left: 10 + (weekindex - 1) * (1 / this.weeklydays.length * 90) + "%",
                top: (lessonindex - 1) * 70 + 40 + "px",
                height: "70px",
                width: 1 / this.weeklydays.length * 90 + '%',
                borderRight: '1px solid rgb(224, 231, 236)',
                borderBottom: '1px solid rgb(224, 231, 236)',
              }
            })
          }
        }
      })
    })
  },
  methods: {

    //判断鼠标是否点中了可拖动的教师课程
    isdragablelesson() {
      let div = document.querySelectorAll('.dragable')
      Array.from(div).map(div => {
        let divposition = $(div).closest('.cells').position()
        let divdimension = {
          h: $(div).closest('.cells').height(),
          w: $(div).closest('.cells').width(),
        }
        if (this.mouseX >= divposition.left && this.mouseX <= divposition.left + divdimension.w && this.mouseY >= divposition.top && this.mouseY <= divposition.top + divdimension.h) {
          let draglessonobj = JSON.parse(div.dataset.cellindex)
          let truelessonobj = this.currenttable.find(i => {
            return _.isEqual(i, draglessonobj)
          })
          //获取到点中的教师课程对象
          //设置拖动状态为真
          this.ondrag = true;
          this.dragedlesson = truelessonobj


          //异步通过教师课程获取班级课表
          this.$emit('fetchclasstable', truelessonobj)


          //渲染一个半透明的教师课程
          let fakelesson = $(div).clone()
          $('.adjustcourseborder').append(fakelesson)
          fakelesson.css({
            position: 'absolute',
            height: divdimension.h,
            width: divdimension.w,
            backgroundColor: 'rgb(43,171,238)',
            left: this.mouseX - divdimension.w / 2,
            top: this.mouseY - divdimension.h / 2,
            zIndex: 2,
            opacity: .8
          })
          this.fakelesson = fakelesson
        }
      })
    },

    //判断鼠标放开时选中的班级课程
    isdragableclasslesson() {

      //删除fakelesson
      if (this.fakelesson) {
        this.fakelesson.remove()
      }
      let div = document.querySelectorAll('.classdragable')
      Array.from(div).map(div => {
        let divposition = $(div).closest('.cells').position()
        let divdimension = {
          h: $(div).closest('.cells').height(),
          w: $(div).closest('.cells').width(),
        }
        if (this.mouseX >= divposition.left && this.mouseX <= divposition.left + divdimension.w && this.mouseY >= divposition.top && this.mouseY <= divposition.top + divdimension.h) {
          let draglessonobj = JSON.parse(div.dataset.cellindex)
          let truelessonobj = this.classtable.find(i => {
            return _.isEqual(i, draglessonobj)
          })
          //获取到点中的教师课程对象
          this.$emit('adjusted', this.dragedlesson, truelessonobj)
        }
      })
    },

    //鼠标移动时候时选中的班级课程
    isdragmoveclasslesson() {
      let div = document.querySelectorAll('.classdragable')

      this.classtable.map(i => {
        if (i.dragable) {
          i.style = {
            backgroundColor: 'white'
          }
        }
      })

      this.refreshit = 0
      setTimeout(i => {
        this.refreshit = 1
      }, 0)

      Array.from(div).map(div => {
        let divposition = $(div).closest('.cells').position()
        let divdimension = {
          h: $(div).closest('.cells').height(),
          w: $(div).closest('.cells').width(),
        }
        if (this.mouseX >= divposition.left && this.mouseX <= divposition.left + divdimension.w && this.mouseY >= divposition.top && this.mouseY <= divposition.top + divdimension.h) {
          let draglessonobj = JSON.parse(div.dataset.cellindex)
          let truelessonobj = this.classtable.find(i => {
            return i.day == draglessonobj.day && i.lesson == draglessonobj.lesson
          })
          //获取到点中的教师课程对象
          truelessonobj.style.backgroundColor = 'rgb(43,171,238)'

          this.refreshit = 0
          setTimeout(i => {
            this.refreshit = 1
          }, 0)

        }
      })
    },

    //鼠标按下
    dragcanvasdown(e) {
      [this.mouseX, this.mouseY] = [e.offsetX, e.offsetY]
      this.isdragablelesson()
    },

    //鼠标放开
    dragcanvasup(e) {
      this.ondrag = false;
      [this.mouseX, this.mouseY] = [e.offsetX, e.offsetY]

      //获取被对换的班级课程
      this.isdragableclasslesson()
    },

    //鼠标移动
    dragcanvasmove(e) {
      if (this.ondrag) {
        [this.mouseX, this.mouseY] = [e.offsetX, e.offsetY]
        this.fakelesson.css({
          backgroundColor: 'rgb(43,171,238)',
          left: e.offsetX - this.fakelesson.width() / 2,
          top: e.offsetY - this.fakelesson.height() / 2
        })
        //提示选中了班级课程
        this.isdragmoveclasslesson()
      }
    },


    //匹配课表单元格和课程
    conversioncell(cell) {
      return this.currenttable.find(i => {
        return i.day + 1 == Number(this.weeklydays[cell.weekindex - 1]) + 1 && i.lesson + 1 == cell.lessonindex
      })
    },

    //匹配课表单元格和班级课程
    conversionclasscell(cell) {

      return this.classtable.find(i => {
        return i.day + 1 == Number(this.weeklydays[cell.weekindex - 1]) + 1 && i.lesson + 1 == cell.lessonindex
      })
    },



    //课程表课程index转换第几节课
    conversionLessonindex(lessonindex, weekindex) {
      if (this.coursetable.morningLesson > 0 && lessonindex < this.coursetable.morningLesson) {
        return `<div>早晨${lessonindex+1}节</div>`
      } else if (this.coursetable.forenoonLesson > 0 && lessonindex < this.coursetable.forenoonLesson + this.coursetable.morningLesson) {
        return `<div>上午${lessonindex+1-this.coursetable.morningLesson}节</div>`
      } else if (this.coursetable.afternoonLesson > 0 && lessonindex < this.coursetable.afternoonLesson + this.coursetable.forenoonLesson + this.coursetable.morningLesson) {
        return `<div>下午${lessonindex+1-(this.coursetable.forenoonLesson+this.coursetable.morningLesson)}节</div>`
      } else if (this.coursetable.eveningLesson > 0 && lessonindex < this.dailylesson) {
        return `<div>晚上${lessonindex+1-this.dailylesson+this.coursetable.eveningLesson}节</div>`
      }
    }
  }
}
