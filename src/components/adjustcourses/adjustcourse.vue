<template>
  <div class="adjustcourseborder" :style='adjustcourseborderstyle'>

    <!-- 虚拟画布 -->
    <div class="dragcanvas" @mousedown='dragcanvasdown($event)' @mouseup='dragcanvasup($event)' @mousemove='dragcanvasmove($event)'></div>

    <div v-for='(cell,cellindex) in emptytable' class="cells" :style='cell.style'>
      <div v-if='cell.html' v-html='cell.html'></div>
      <div v-else>


        <div v-if='conversionclasscell(cell) && ondrag && refreshit'>
          <!-- //班级课程显示 -->
          <div v-if='conversionclasscell(cell).dragable' :data-cellindex='JSON.stringify(conversionclasscell(cell))' :style='conversionclasscell(cell).style' class="classdragable">
            {{conversionclasscell(cell).courseName}}
          </div>
          <div v-else class="classunable">
            {{conversionclasscell(cell).courseName}}
          </div>
        </div>


        <div v-if='conversioncell(cell) && !ondrag'>
          <!-- //教师课程显示 -->
          <div v-if='conversioncell(cell).dragable' :data-cellindex='JSON.stringify(conversioncell(cell))' class="dragable">
            {{conversioncell(cell).courseName}}
          </div>
          <div v-else class="unable">
            {{conversioncell(cell).courseName}}
          </div>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script>
  export default require('./adjustcourse.js')

</script>
<style scoped>
  .adjustcourseborder {
    user-select: none;
    border: 1px solid rgb(224, 231, 236);
    border-right: none;
    border-bottom: none;
    position: relative;
  }

  .dragable {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .classdragable {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .classunable{
    position: absolute;
    background: rgb(244,244,244);
    border-left: 2px solid rgb(181,181,181);
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .unable {
    position: absolute;
    background: url('./unable.jpg');
    background-repeat: no-repeat;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dragcanvas {
    position: absolute;
    z-index: 10;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
  }

  .cells {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  * {
    box-sizing: border-box;
  }

</style>
