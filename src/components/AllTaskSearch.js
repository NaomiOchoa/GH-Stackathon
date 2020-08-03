import React, { useContext } from "react";
import _ from "lodash";
import { Search } from "semantic-ui-react";
import { TasksContext } from "../providers/TasksProvider";

export default function AllTaskSearch(props) {
  const [loadingState, setLoadingState] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [value, setValue] = React.useState("");
  const { setTaskAsActive } = props;
  const { inactiveTasks } = useContext(TasksContext);

  const formattedTasks = inactiveTasks.map((task) => {
    return { title: task.taskName, id: task.id };
  });

  function handleResultSelect(e, { result }) {
    setTaskAsActive(result.id);
    setLoadingState(false);
    setResults([]);
    setValue("");
  }

  function handleSearchChange(e, { value }) {
    setLoadingState(true);
    setValue(e.target.value);

    setTimeout(() => {
      if (value.length < 1) {
        setLoadingState(false);
        setResults([]);
        setValue("");
      }

      const re = new RegExp(_.escapeRegExp(value), "i");
      const isMatch = (result) => re.test(result.title);

      setLoadingState(false);
      setResults(_.filter(formattedTasks, isMatch));
    }, 300);
  }

  return (
    <Search
      placeholder="Search tasks..."
      aligned="right"
      loading={loadingState}
      onResultSelect={handleResultSelect}
      onSearchChange={_.debounce(handleSearchChange, 500, {
        leading: true,
      })}
      results={results}
      value={value}
    />
  );
}
