<template>
  <div class="test">

    <div style="margin:20px;">

      <adjustcourse 
      @adjusted='adjusted' 
      @fetchclasstable='fetchclasstable' 
      :coursetable='coursetable'
      :currenttable='currenttable' 
      :classtable='classtable' />

    </div>

  </div>
</template>

<script>
  import adjustcourse from "./adjustcourses/adjustcourse.vue"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',


        /**
         * 组件需要传入的参数
         * 
         * 
         */
        //课表模板
        coursetable: {
          morningLesson: 2,
          forenoonLesson: 4,
          afternoonLesson: 3,
          eveningLesson: 1,
          days: "0,1,2,3,4,5,6"
        },

        // 班级课表
        classtable: [],
        //教师课表
        currenttable: [{
            day: 0,
            lesson: 0,
            courseName: '语文1',
            userName: "试试",
            dragable: 1,
          },
          {
            day: 3,
            lesson: 3,
            courseName: '语文2',
            userName: "试试",
            dragable: 1,
          }, {
            day: 4,
            lesson: 5,
            courseName: '语文3',
            userName: "试试",
            dragable: 0,
          }
        ],
      }
    },
    components: {
      adjustcourse
    },
    mounted() {
      //测试刷新课表
      setTimeout(i => {
        this.currenttable[1].courseName = 'ssssee'
        this.currenttable[1].day = 0
      }, 1111)
    },
    methods: {
      fetchclasstable(teacherlesson) {
        //拖住的教师课程，获取到新学生课表后更新
        console.log(teacherlesson)
        setTimeout(i => {
          this.classtable = [{
              day: 0,
              lesson: 6,
              courseName: '数学1111',
              userName: "试试",
              dragable: 1,
            },
            {
              day: 1,
              lesson: 6,
              courseName: '数学222',
              userName: "试试",
              dragable: 1,
            }, {
              day: 4,
              lesson: 3,
              courseName: '数3学3',
              userName: "试试",
              dragable: 0,
            }
          ]
        }, 1111)
      },
      adjusted(teacherlesson, classlesson) {
        console.log(teacherlesson, '换', classlesson)


        //
      }
    }
  }

</script>
