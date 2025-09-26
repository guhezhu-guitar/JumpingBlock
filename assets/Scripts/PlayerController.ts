import { _decorator, Component, EventMouse, Input, input, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    private _startTime =false;
    private _jumpTime =0.2;
    private _curJumpTime = 0;
    private _jumpSpeed = 0;

    start() {
        input.on(Input.EventType.MOUSE_DOWN,this.onMouseDown,this)
    }

    onMouseDown(event:EventMouse){
        //判断鼠标左键和右键
        if(event.getButton()==0){
            this.jumpByStep(1);
        }else if(event.getButton()==2){
            this.jumpByStep(2);
        }
    }

    jumpByStep(step:number){
        //这样的移动没有移动的轨迹
        // const curPos = this.node.position;
        // this.node.setPosition(curPos.x+40*step,curPos.y,curPos.z);

        this._startTime =true;  //跳跃开始  
        this._curJumpTime = 0;  //开始计时
        this._jumpSpeed =step*40/this._jumpTime;
    }

    protected update(dt: number): void {
        if(this._startTime){
            this._curJumpTime +=dt;
            if(this._curJumpTime > this._jumpTime){
                this._startTime =false;
            }else{
                const curPos =this.node.position;
                this.node.setPosition(curPos.x+this._jumpSpeed*dt,curPos.y,curPos.z);
            }
        }
    }



    //用于事件取消绑定的事件(本质还是销毁)
    protected onDestroy(): void {
     input.off(Input.EventType.MOUSE_DOWN,this.onMouseDown,this)
    }
}


