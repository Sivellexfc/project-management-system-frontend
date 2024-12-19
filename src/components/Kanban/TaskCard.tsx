import React, { useState } from 'react'

const TaskCard = ({task}) => {
    const [point,setPoint] = useState(task.point);
  return (
    <div draggable className='rounded-md px-2 m-2 bg-white w-65 border-l-4 border-red-500 w-[500px]'>
        <div className='text-base font-medium py-2'>
            {task.title}
        </div>
        <div className='flex gap-4 justify-between py-2 text-gray-700'>
            <div>{task.id}</div>
            <div>{point}
                <button onClick={(e) => setPoint(point + 1) }>+</button>
            </div>
        </div>
    </div>
  )
}

export default TaskCard