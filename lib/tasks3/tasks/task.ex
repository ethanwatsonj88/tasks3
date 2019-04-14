defmodule Tasks3.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :completed, :boolean, default: false
    field :description, :string
    field :time_spent, :integer
    field :title, :string

		belongs_to :user, Tasks3.Users.User

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:title, :description, :time_spent, :user_id])
    |> validate_required([:title, :description, :time_spent])
		|> unique_constraint(:user_id, name: :tasks_user_id_index)
  end
end
