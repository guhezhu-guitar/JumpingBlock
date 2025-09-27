import { _decorator,  Animation,  Component, EventMouse, Input, input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    private _startTime =false;
    private _startJump =false;
    private _jumpTime =0.2;
    private _curJumpTime = 0;
    private _jumpSpeed = 0;
    private _targetPos = new Vec3();
    private _curPos = new Vec3();

    //引入body上面的Animation组件
    @property(Animation)
    public bodyAnim : Animation =null;

    start() {
        // input.on(Input.EventType.MOUSE_DOWN,this.onMouseDown,this)
    }
    //给player控制状态设置一个方法,判断玩家这时候会不会被控制,用于ui制作时在菜单界面解绑对玩家的一个控制
    public setIsControl(value:boolean){
        if(value){
            input.on(Input.EventType.MOUSE_DOWN,this.onMouseDown,this);    //表示可以被控制
            }else {
                input.off(Input.EventType.MOUSE_DOWN,this.onMouseDown,this);    //表示不能被控制
    }
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

        //在移动的时候再点击就不触发后面的代码
        if(this._startTime){
            return;
        }

        //获取动画的名称,方法是使用三元运算符
        const animName = step == 1? 'jumpOneStep':'jumpTwoStep';


        //获取动画的状态
        const animState =this.bodyAnim.getState(animName);
        //获取动画的时间
        this._jumpTime=animState.duration;

        const moveLength = step*40;
        this._startTime =true;  //跳跃开始  
        this._startJump =true;
        this._curJumpTime = 0;  //开始计时
        this._jumpSpeed =step*40/this._jumpTime;
        //得到当前的位置
        this.node.getPosition(this._curPos);
        this._targetPos =new Vec3(this._curPos.x+moveLength,this._curPos.y,this._curPos.z);
        Vec3.add(this._targetPos,this._curPos,new Vec3(moveLength,0,0));

        //跳跃的时候播放动画
        // if(step==1){
        // this.bodyAnim.play('jumpOneStep');
        // }else if(step==2){
        // this.bodyAnim.play('jumpTwoStep');
        // }

        //让动画的时间和跳跃时间重合,使用统一的jumpTime的值
        this.bodyAnim.play(animName)
        
    }


    protected update(dt: number): void {
        if(this._startTime){
            this._curJumpTime +=dt;
            if(this._curJumpTime > this._jumpTime){
                this._startTime =false;
                //移动的精准性
                this.node.setPosition(this._targetPos)
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


