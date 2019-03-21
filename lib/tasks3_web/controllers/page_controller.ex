defmodule Tasks3Web.PageController do
  use Tasks3Web, :controller

  def index(conn, _params) do
		tasks = Tasks3.Tasks.list_tasks()
		|> Enum.map(&(Map.take(&1, [:id, :title, :description, :completed, :user_id])))
    render(conn, "index.html", tasks: tasks)
  end
end
