// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 { function transfer(address,uint256) external returns(bool); function transferFrom(address,address,uint256) external returns(bool); }

contract NXTPair {
    address public immutable token0; address public immutable token1; address public immutable factory;
    address public feeRecipient; uint16 public feeBps; bool public paused;
    uint112 public reserve0; uint112 public reserve1; uint256 public totalLiquidity;
    mapping(address=>uint256) public liquidityOf;
    event LiquidityAdded(address indexed provider,uint256 amount0,uint256 amount1,uint256 liquidity);
    event LiquidityRemoved(address indexed provider,uint256 amount0,uint256 amount1,uint256 liquidity);
    event Swap(address indexed sender,address indexed tokenIn,uint256 amountIn,address tokenOut,uint256 amountOut);

    modifier onlyFactory(){ require(msg.sender==factory,"factory"); _; }
    constructor(address a,address b,address treasury,uint16 fee){ token0=a; token1=b; factory=msg.sender; feeRecipient=treasury; feeBps=fee; }
    function setPaused(bool v) external onlyFactory { paused=v; }

    function addLiquidity(uint256 a0,uint256 a1,uint256 minL) external returns(uint256 l){
        require(!paused && a0>0 && a1>0,"invalid");
        require(IERC20(token0).transferFrom(msg.sender,address(this),a0),"token0");
        require(IERC20(token1).transferFrom(msg.sender,address(this),a1),"token1");
        l=totalLiquidity==0?sqrt(a0*a1):min(a0*totalLiquidity/reserve0,a1*totalLiquidity/reserve1);
        require(l>=minL && l>0,"liquidity");
        totalLiquidity+=l; liquidityOf[msg.sender]+=l; reserve0+=uint112(a0); reserve1+=uint112(a1);
        emit LiquidityAdded(msg.sender,a0,a1,l);
    }

    function removeLiquidity(uint256 l,uint256 min0,uint256 min1) external returns(uint256 a0,uint256 a1){
        require(!paused && l>0 && liquidityOf[msg.sender]>=l,"invalid");
        a0=uint256(reserve0)*l/totalLiquidity; a1=uint256(reserve1)*l/totalLiquidity;
        require(a0>=min0 && a1>=min1,"minimum");
        liquidityOf[msg.sender]-=l; totalLiquidity-=l; reserve0-=uint112(a0); reserve1-=uint112(a1);
        require(IERC20(token0).transfer(msg.sender,a0),"token0"); require(IERC20(token1).transfer(msg.sender,a1),"token1");
        emit LiquidityRemoved(msg.sender,a0,a1,l);
    }

    function quote(uint256 amountIn,address tokenIn) public view returns(uint256 out){
        bool z=tokenIn==token0; require(z||tokenIn==token1,"token");
        uint256 ri=z?reserve0:reserve1; uint256 ro=z?reserve1:reserve0;
        uint256 f=amountIn*(10000-feeBps); out=f*ro/(ri*10000+f);
    }

    function swap(uint256 amountIn,address tokenIn,uint256 minOut,uint256 deadline) external returns(uint256 out){
        require(!paused && block.timestamp<=deadline && amountIn>0,"invalid");
        bool z=tokenIn==token0; require(z||tokenIn==token1,"token");
        address outToken=z?token1:token0; out=quote(amountIn,tokenIn);
        require(out>=minOut && out>0,"slippage");
        uint256 fee=amountIn*feeBps/10000; uint256 net=amountIn-fee;
        require(IERC20(tokenIn).transferFrom(msg.sender,address(this),amountIn),"input");
        require(IERC20(tokenIn).transfer(feeRecipient,fee),"fee");
        require(IERC20(outToken).transfer(msg.sender,out),"output");
        if(z){reserve0+=uint112(net);reserve1-=uint112(out);}else{reserve1+=uint112(net);reserve0-=uint112(out);}
        require(reserve0>0&&reserve1>0,"empty");
        emit Swap(msg.sender,tokenIn,amountIn,outToken,out);
    }

    function min(uint256 a,uint256 b) internal pure returns(uint256){return a<b?a:b;}
    function sqrt(uint256 y) internal pure returns(uint256 z){if(y>3){z=y;uint256 x=y/2+1;while(x<z){z=x;x=(y/x+x)/2;}}else if(y!=0)z=1;}
}

contract NXTFactory {
    address public owner; address public treasury; uint16 public feeBps; bool public paused;
    mapping(address=>mapping(address=>address)) public getPair; address[] public allPairs;
    event PairCreated(address indexed token0,address indexed token1,address pair);
    modifier onlyOwner(){require(msg.sender==owner,"owner");_;}
    constructor(address t,uint16 f){require(t!=address(0)&&f<=1000,"config");owner=msg.sender;treasury=t;feeBps=f;}
    function createPair(address a,address b) external onlyOwner returns(address p){
        require(a!=address(0)&&b!=address(0)&&a!=b,"token");
        (address x,address y)=a<b?(a,b):(b,a); require(getPair[x][y]==address(0),"exists");
        p=address(new NXTPair(x,y,treasury,feeBps));getPair[x][y]=p;getPair[y][x]=p;allPairs.push(p);emit PairCreated(x,y,p);
    }
    function setTreasury(address t) external onlyOwner {require(t!=address(0),"treasury");treasury=t;}
    function setFeeBps(uint16 f) external onlyOwner {require(f<=1000,"fee");feeBps=f;}
    function setPaused(bool v) external onlyOwner {paused=v;for(uint256 i;i<allPairs.length;i++)NXTPair(allPairs[i]).setPaused(v);}
}
