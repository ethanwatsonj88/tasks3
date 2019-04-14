defmodule Tasks3.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :manager, :boolean, default: false
    field :password_hash, :string
		
		has_many :tasks, Tasks3.Tasks.Task

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :password_hash, :manager])
    |> validate_required([:email, :password_hash])
    |> unique_constraint(:email)
  end
end
