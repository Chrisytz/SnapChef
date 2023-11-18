import {useState} from 'react'
import {useDispatch} from "react-redux";
import {createGoal} from '../features/goals/goalSlice'

function GoalForm() {

    const [text, setText] = useState('')

    const dispatch = useDispatch()
    const onSubmit = e => {
        // prevents the default form submission behavior, which would cause a page reload
        e.preventDefault()

        // this text is the text state declared on line 7
        dispatch(createGoal({text}))
        setText('')
    }
    return (
        <section className='form'>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='text'> Goal </label>
                    <input
                        type='text'
                        name='text'
                        id='text'
                        // curly braces indicate javascript expression, this is the text state declared on line 7
                        value={text}
                        onChange={(e) => setText(e.target.value)} />
                </div>
                <div className='form-group'>
                    <button className='btn btn-block'>
                        Add Goal
                    </button>
                </div>
            </form>
        </section>
    )
}

export default GoalForm