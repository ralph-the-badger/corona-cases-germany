const Dropdown = ({options, id, selectedValue, onSelectedValueChange}) => {
  return(   
    <select 
      name="y-values" 
      id={id} 
      onChange={event => onSelectedValueChange(event.value)}
    >
      {options.map(({value, label}) => (
        <option 
          key={Math.random()*1000000}
          value={value}
          selected={value === selectedValue}          
        >{label}</option>
      ))}
    </select>
  )
}

export default Dropdown;