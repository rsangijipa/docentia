create function "get_age"(employee_id integer) RETURNS smallint
  LANGUAGE "sql"
AS $$
  select age
  from employees
  where id = employee_id;
$$;
